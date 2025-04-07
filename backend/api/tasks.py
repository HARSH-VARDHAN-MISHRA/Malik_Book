from celery import shared_task


@shared_task
def test_task():
    print("This is a test task")
    return "Test Task completed successfully"

@shared_task(name="api.tasks.feed_opening_balance")
def feed_opening_balance():
    from api.models import DailyBalance,DailyOpeningBankBalance,DailyOpeningCashBalance,Shop,ShopCash,BankAccount
    from datetime import datetime
    all_shops=Shop.objects.all()
    for shop in all_shops:
        try:
            todays_balance=DailyBalance.objects.filter(shop=shop,date=datetime.now().date()).last()
            if not todays_balance:
                todays_balance=DailyBalance(shop=shop,date=datetime.now().date())
                todays_balance.save()
            if not DailyOpeningBankBalance.objects.filter(daily_balance=todays_balance).exists():
                bank_accounts=BankAccount.objects.filter(shop=shop)
                for bank_account in bank_accounts:
                    opening_balance=DailyOpeningBankBalance(daily_balance=todays_balance,bank_account=bank_account,amount=bank_account.balance)
                    opening_balance.save()
            if not DailyOpeningCashBalance.objects.filter(daily_balance=todays_balance).exists():
                cash_balances=ShopCash.objects.filter(shop=shop)
                for cash in cash_balances:
                    opening_balance=DailyOpeningCashBalance(daily_balance=todays_balance,currency=cash.currency,quantity=cash.quantity)
                    opening_balance.save()
        except:
            pass
    return "Opening balance feeded successfully"

@shared_task
def feed_closing_balance(name="api.tasks.feed_closing_balance"):
    from api.models import DailyBalance,DailyClosingBankBalance,DailyClosingCashBalance,Shop,ShopCash,BankAccount
    from datetime import datetime
    all_shops=Shop.objects.all()
    for shop in all_shops:
        try:
            todays_balance=DailyBalance.objects.filter(shop=shop,date=datetime.now().date()).last()
            if not todays_balance:
                todays_balance=DailyBalance(shop=shop,date=datetime.now().date())
                todays_balance.save()
            if not DailyClosingBankBalance.objects.filter(daily_balance=todays_balance).exists():
                bank_accounts=BankAccount.objects.filter(shop=shop)
                for bank_account in bank_accounts:
                    closing_balance=DailyClosingBankBalance(daily_balance=todays_balance,bank_account=bank_account,amount=bank_account.balance)
                    closing_balance.save()
            if not DailyClosingCashBalance.objects.filter(daily_balance=todays_balance).exists():
                cash_balances=ShopCash.objects.filter(shop=shop)
                for cash in cash_balances:
                    closing_balance=DailyClosingCashBalance(daily_balance=todays_balance,currency=cash.currency,quantity=cash.quantity)
                    closing_balance.save()
        except:
            pass
    return "Closing balance feeded successfully"