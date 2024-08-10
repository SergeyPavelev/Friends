from django.db import models
from django.contrib.auth import get_user_model


User = get_user_model()

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sender', verbose_name='Отправитель')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, default=None, related_name='receiver', verbose_name='Получатель')
    room = models.CharField('Chat Room', max_length=10)
    text_message = models.TextField('Текст сообщения')
    date_created = models.DateTimeField('Время отправки', auto_now_add=True)
    is_readed = models.BooleanField('Прочитано', default=False)
    sender_visibility = models.BooleanField('Отображение у отправителя', default=True)
    receiver_visibility = models.BooleanField('Отображение у получателя', default=True)
    
    objects = models.Manager() # менеджер по-умолчанию, для работы с объектами модели
        
    def __str__(self):
        return  f'{self.sender} - {self.receiver}: {self.text_message} [{self.date_created}]'

    
    class Meta:
        ordering = ['date_created']
        
        verbose_name = 'Message'
        verbose_name_plural = 'Messages'


class Room(models.Model):
    users = models.ManyToManyField(User, blank=True)

    def __str__(self):
        return f'{self.pk}'
    
    class Meta:
        verbose_name = 'Room'
        verbose_name_plural = 'Rooms'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    @property
    def last_message(self):
        return Message.objects.filter(room=self).order_by('-date_created').first()

    def can_send_messages(self, user):
        return user in self.users.all()

    @staticmethod
    def create_or_get_room(user1, user2):
        # Проверяем, существует ли комната с этими пользователями
        existing_room = Room.objects.filter(users__in=[user1]).filter(users__in=[user2]).first()
        
        print(Room.objects.filter(users__in=[user1]).filter(users__in=[user2]))

        if existing_room:
            # Если комната уже существует, возвращаем ее
            return existing_room
        else:
            # Если комнаты с такими пользователями нет, создаем новую комнату
            new_room = Room.objects.create()
            new_room.users.add(user1, user2)
            return new_room
