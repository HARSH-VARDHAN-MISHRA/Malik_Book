# Generated by Django 5.0.7 on 2025-04-07 12:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_alter_depositwithdrawhistory_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dailyclosingbankbalance',
            name='amount',
            field=models.FloatField(),
        ),
        migrations.AlterField(
            model_name='dailyopeningbankbalance',
            name='amount',
            field=models.FloatField(),
        ),
    ]
