# Generated by Django 5.1.6 on 2025-03-08 13:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('registration', '0008_alter_user_first_login'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='avatar',
            field=models.ImageField(default='', null=True, upload_to='profiles/'),
        ),
        migrations.AlterField(
            model_name='user',
            name='first_login',
            field=models.DateTimeField(null=True),
        ),
    ]
