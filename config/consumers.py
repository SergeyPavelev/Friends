import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import get_user_model
from ..src.messenger.models import Message, Conversation, UserStatus


User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        if isinstance(self.user, AnonymousUser):
            await self.close()
            return
        
        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        await self.channel_layer.group_add(
            self.conversation_id,
            self.channel_name,
        )
        
        await self.set_user_status(online=True)
        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, 'conversation_id'):
            await self.channel_layer.group_discard(
                self.conversation_id,
                self.channel_name,
            )
        
        await self.set_user_status(online=False)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get('type')
        
        if message_type == 'message':
            text = text_data_json['text']
            
            conversation = await self.get_conversation()
            message = await self.create_message(conversation, text)
            
            await self.channel_layer.group_send(
                self.conversation_id,
                {
                    'type': 'chat_message',
                    'message_id': str(message.id),
                    'sender_id': str(self.user.id),
                    'text': text,
                    'timestamp': message.timestamp.isoformat(),
                }
            )
        
        elif message_type == 'typing':
            await self.channel_layer.group_send(
                self.conversation_id,
                {
                    'type': 'typing_indicator',
                    'user_id': str(self.user.id),
                    'is_typing': text_data_json['is_typing'],
                }
            )
    
    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'message',
            'message_id': event['message_id'],
            'sender_id': event['sender_id'],
            'text': event['text'],
            'timestamp': event['timestamp'],
        }))
    
    async def typing_indicator(self, event):
        if str(self.user.id) != event['user_id']:
            await self.send(text_data=json.dumps({
                'type': 'typing',
                'user_id': event['user_id'],
                'is_typing': event['is_typing'],
            }))
    
    @database_sync_to_async
    def get_conversation(self):
        return Conversation.objects.get(pk=self.conversation_id)
    
    @database_sync_to_async
    def create_message(self, conversation, text):
        message = Message.objects.create(
            conversation=conversation,
            sender=self.user,
            text=text,
        )
        conversation.save() #Update modified_at
        return message
    
    @database_sync_to_async
    def set_user_status(self, online):
        UserStatus.objects.update_or_create(
            user=self.user,
            defaults={'online': online},
        )
