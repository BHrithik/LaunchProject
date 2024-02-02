# Generated by Django 4.2.1 on 2024-02-02 10:47

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("account", "0002_user_role"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="role",
            field=models.CharField(
                choices=[("agent", "Admin"), ("manager", "EMT Doctor")],
                default="agent",
                max_length=20,
            ),
        ),
    ]