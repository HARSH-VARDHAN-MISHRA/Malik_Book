# Generated by Django 5.0.7 on 2025-04-05 21:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_depositwithdrawhistory_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='depositwithdrawhistory',
            name='remark',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
