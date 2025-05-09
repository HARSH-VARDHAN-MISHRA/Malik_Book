# Generated by Django 5.0.7 on 2025-04-05 10:59

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_customer_email'),
    ]

    operations = [
        migrations.CreateModel(
            name='DepositWithdrawHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('type', models.CharField(max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.user')),
                ('shop', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.shop')),
            ],
        ),
        migrations.CreateModel(
            name='DepositWithdrawHistoryCashDenomination',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.PositiveIntegerField()),
                ('currency', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.currency')),
                ('deposit_withdraw_history', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.depositwithdrawhistory')),
            ],
        ),
        migrations.CreateModel(
            name='DepositWithdrawHistoryPaymentDetail',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.PositiveIntegerField()),
                ('bank_account', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.bankaccount')),
                ('deposit_withdraw_history', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.depositwithdrawhistory')),
            ],
        ),
    ]
