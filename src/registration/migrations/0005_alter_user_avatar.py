# Generated by Django 5.1.6 on 2025-03-08 12:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('registration', '0004_alter_user_middle_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='avatar',
            field=models.ImageField(blank=True, null=True, upload_to='avatars/'),
        ),
    ]
