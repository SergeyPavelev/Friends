# Generated by Django 5.0.1 on 2024-03-20 18:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('register', '0005_users_profile_photo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='users',
            name='profile_photo',
            field=models.ImageField(blank=True, null=True, upload_to=''),
        ),
    ]
