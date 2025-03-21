# Generated by Django 5.1.3 on 2024-12-11 18:35

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('room', models.CharField(max_length=10, verbose_name='Chat Room')),
                ('text_message', models.TextField(verbose_name='Текст сообщения')),
                ('date_created', models.DateTimeField(auto_now_add=True, verbose_name='Дата отправки')),
                ('time_created', models.TimeField(auto_now_add=True, verbose_name='Время отправки')),
                ('is_readed', models.BooleanField(default=False, verbose_name='Прочитано')),
                ('sender_visibility', models.BooleanField(default=True, verbose_name='Отображение у отправителя')),
                ('receiver_visibility', models.BooleanField(default=True, verbose_name='Отображение у получателя')),
                ('receiver', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='receiver', to=settings.AUTH_USER_MODEL, verbose_name='Получатель')),
                ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sender', to=settings.AUTH_USER_MODEL, verbose_name='Отправитель')),
            ],
            options={
                'verbose_name': 'Message',
                'verbose_name_plural': 'Messages',
                'ordering': ['date_created'],
            },
        ),
        migrations.CreateModel(
            name='Room',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('users', models.ManyToManyField(blank=True, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Room',
                'verbose_name_plural': 'Rooms',
            },
        ),
    ]
