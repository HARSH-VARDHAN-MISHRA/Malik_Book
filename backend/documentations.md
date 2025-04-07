clear old task in db ======== 

redis-cli FLUSHALL

run celery =================
celery -A malik_book worker --loglevel=info

run celery beat ==================
celery -A malik_book beat --scheduler django_celery_beat.schedulers.DatabaseScheduler --loglevel=info

