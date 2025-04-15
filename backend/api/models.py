from django.db import models

class Shop(models.Model):
    name = models.CharField(max_length=255,unique=True)
    address = models.CharField(max_length=255,null=True,blank=True)
    contact_number = models.CharField(max_length=20,null=True,blank=True)
    def __str__(self):
        return self.name
    def save(self, *args, **kwargs):
        is_new = self.pk is None  # Check if the object is new
        super(Shop, self).save(*args, **kwargs)  # Save the shop first to generate pk
        
        if is_new:
            # Ensure required currency values exist
            default_currency_values = [1, 2, 5, 10, 20, 50, 100, 200, 500]
            existing_currencies = Currency.objects.values_list('currency', flat=True)

            # Create missing currencies
            for value in default_currency_values:
                if value not in existing_currencies:
                    Currency.objects.create(currency=value)

            # Now retrieve all currency objects after ensuring all exist
            all_currencies = Currency.objects.all()

            # Create ShopCash entries
            shop_cash_entries = [
                ShopCash(shop=self, currency=currency, quantity=0) for currency in all_currencies
            ]
            ShopCash.objects.bulk_create(shop_cash_entries)

    
class User(models.Model):
    email=models.CharField(max_length=200,unique=True)
    name=models.CharField(max_length=255,unique=True)
    password=models.CharField(max_length=200)
    shop=models.ForeignKey(Shop,on_delete=models.CASCADE,null=True,blank=True)
    is_active=models.BooleanField(default=True)
    role=models.CharField(max_length=200,null=True,blank=True,default="User")

    def __str__(self):
        return f"{self.email} => {self.name} => {self.shop}" 
    
class UserToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token=models.TextField()
    def __str__(self):
        return f"{self.user.email}"

class Currency(models.Model):
    currency=models.PositiveIntegerField(unique=True)
    def __str__(self):
        return f"{self.currency}"
    
class BankAccount(models.Model):
    shop=models.ForeignKey(Shop, on_delete=models.CASCADE, null=True, blank=True)
    bank_name=models.CharField(max_length=200,null=True,blank=True)
    account_name=models.CharField(max_length=100)
    account_number=models.CharField(max_length=100,null=True,blank=True)
    ifsc_code=models.CharField(max_length=100,null=True,blank=True)
    balance=models.FloatField(default=0.00)
    def __str__(self):
        return f"{self.shop.name} => {self.account_name} => {self.account_number} {(self.bank_name)}"
    
class ShopCash(models.Model):
    shop=models.ForeignKey(Shop, on_delete=models.CASCADE)
    currency=models.ForeignKey(Currency,on_delete=models.SET_NULL,null=True,blank=True)
    quantity=models.PositiveIntegerField()
    def __str__(self):
        return f"{self.shop.name} => {self.quantity} x {self.currency}"
    class Meta:
        unique_together = ('shop', 'currency')
    

class Customer(models.Model):
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=200,null=True,blank=True)
    phone=models.CharField(max_length=50,unique=True)
    address=models.CharField(max_length=255,null=True,blank=True)
    def __str__(self):
        return f"{self.name}"

class TransactionType(models.Model):
    transaction_type=models.CharField(max_length=100,unique=True)
    def __str__(self):
        return f"{self.transaction_type}"
    
class Transaction(models.Model):
    date=models.DateField(auto_now_add=True)
    customer=models.ForeignKey(Customer,on_delete=models.CASCADE)
    shop=models.ForeignKey(Shop,on_delete=models.SET_NULL,null=True,blank=True)
    transaction_type=models.ForeignKey(TransactionType,on_delete=models.SET_NULL,null=True,blank=True)
    created_by=models.ForeignKey(User,on_delete=models.SET_NULL,null=True,blank=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    remark=models.TextField(null=True,blank=True)
    def __str__(self):
        return f"{self.date} => {self.shop.name}"

class TransactionCashDenomination(models.Model):
    transaction=models.ForeignKey(Transaction,on_delete=models.CASCADE)
    currency=models.ForeignKey(Currency,on_delete=models.SET_NULL,null=True,blank=True)
    quantity=models.PositiveIntegerField()
    def __str__(self):
        return f"{self.transaction.date} => {self.currency} => {self.quantity}"

class TransactionPaymentDetail(models.Model):
    transaction=models.ForeignKey(Transaction,on_delete=models.CASCADE)
    bank_account=models.ForeignKey(BankAccount,on_delete=models.SET_NULL,null=True,blank=True)
    amount=models.PositiveIntegerField()
    def __str__(self):
        return f"{self.transaction.pk} => {self.bank_account.account_name} => {self.amount}"
    
class DailyBalance(models.Model):
    date=models.DateField()
    shop=models.ForeignKey(Shop,on_delete=models.CASCADE)
    def __str__(self):
        return f"{self.date} => {self.shop.name}"
    
class DailyOpeningCashBalance(models.Model):
    daily_balance=models.ForeignKey(DailyBalance,on_delete=models.CASCADE)
    currency=models.ForeignKey(Currency,on_delete=models.SET_NULL,null=True,blank=True)
    quantity=models.PositiveIntegerField()
    def __str__(self):
        return f"{self.daily_balance.pk} => {self.currency} x {self.quantity}"

class DailyClosingCashBalance(models.Model):
    daily_balance=models.ForeignKey(DailyBalance,on_delete=models.CASCADE)
    currency=models.ForeignKey(Currency,on_delete=models.SET_NULL,null=True,blank=True)
    quantity=models.PositiveIntegerField()
    def __str__(self):
        return f"{self.daily_balance.pk} => {self.currency} x {self.quantity}"
    
class DailyOpeningBankBalance(models.Model):
    daily_balance=models.ForeignKey(DailyBalance,on_delete=models.CASCADE)
    bank_account=models.ForeignKey(BankAccount,on_delete=models.SET_NULL,null=True,blank=True)
    amount=models.FloatField()
    def __str__(self):
        return f"{self.daily_balance.pk} => {self.bank_account.account_name} => {self.amount}"
    
class DailyClosingBankBalance(models.Model):
    daily_balance=models.ForeignKey(DailyBalance,on_delete=models.CASCADE)
    bank_account= models.ForeignKey(BankAccount,on_delete=models.SET_NULL,null=True,blank=True)
    amount=models.FloatField()
    def __str__(self):
        return f"{self.daily_balance.pk} => {self.bank_account.account_name} => {self.amount}"
    


class DepositWithdrawHistory(models.Model):
    shop=models.ForeignKey(Shop,on_delete=models.CASCADE)
    date=models.DateField(auto_now_add=True)
    type=models.CharField(max_length=100)
    remark=models.CharField(max_length=255,null=True,blank=True)
    created_by=models.ForeignKey(User,on_delete=models.SET_NULL,null=True,blank=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"{self.date} => {self.shop.name} "
    
class DepositWithdrawHistoryCashDenomination(models.Model):
    deposit_withdraw_history=models.ForeignKey(DepositWithdrawHistory,on_delete=models.CASCADE)
    currency=models.ForeignKey(Currency,on_delete=models.SET_NULL,null=True,blank=True)
    quantity=models.PositiveIntegerField()
    def __str__(self):
        return f"{self.deposit_withdraw_history.pk} => {self.currency} x {self.quantity}"
    
class DepositWithdrawHistoryPaymentDetail(models.Model):
    deposit_withdraw_history=models.ForeignKey(DepositWithdrawHistory,on_delete=models.CASCADE)
    bank_account=models.ForeignKey(BankAccount,on_delete=models.SET_NULL,null=True,blank=True)
    amount=models.PositiveIntegerField()
    def __str__(self):
        return f"{self.deposit_withdraw_history.pk} => {self.bank_account.account_name} => {self.amount}"
    

class ServiceType(models.Model):
    service_type=models.CharField(max_length=255,unique=True)
    def __str__(self):
        return str(self.service_type)
    
class Service(models.Model):
    shop=models.ForeignKey(Shop,on_delete=models.SET_NULL,null=True,blank=True)
    service_type=models.ForeignKey(ServiceType,on_delete=models.CASCADE)
    customer=models.ForeignKey(Customer,on_delete=models.CASCADE)
    note=models.TextField(null=True,blank=True)
    created_by=models.ForeignKey(User,on_delete=models.SET_NULL,null=True,blank=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"{self.customer.name} => {self.service_type.service_type}"
    
class ServiceCashDinomination(models.Model):
    service=models.ForeignKey(Service,on_delete=models.CASCADE)
    currency=models.ForeignKey(Currency,on_delete=models.SET_NULL,null=True,blank=True)
    quantity=models.PositiveIntegerField()

    def __str__(self):
        return f"{self.service.pk} => {self.currency} x {self.quantity}"

class ServicePayment(models.Model):
    service=models.ForeignKey(Service,on_delete=models.CASCADE)
    bank_account=models.ForeignKey(BankAccount,on_delete=models.SET_NULL,null=True,blank=True)
    amount=models.PositiveIntegerField()
    def __str__(self):
        return f"{self.service.pk} => {self.bank_account.account_name if self.bank_account else "Unknown aacount"} => {self.amount}"
    


