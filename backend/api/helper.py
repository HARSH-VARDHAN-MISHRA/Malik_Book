from django_celery_beat.models import PeriodicTask, CrontabSchedule
import json


def create_scheduled_task_for_feed_opening_balance():
    # Delete the existing task if it exists
    PeriodicTask.objects.filter(name="Feed Opening Balance").delete()

    # Create or get crontab schedule
    schedule, _ = CrontabSchedule.objects.get_or_create(
        minute="5",
        hour="0",  # 12:05 AM
        day_of_week="*",
        day_of_month="*",
        month_of_year="*",
    )

    # Create periodic task
    task = PeriodicTask.objects.create(
        crontab=schedule,
        name="Feed Opening Balance",
        task="api.tasks.feed_opening_balance",
    )

    print("Feed Opening Balance Task scheduled for 12:05 AM successfully.")
def create_scheduled_task_for_feed_closing_balance():
    # Delete the existing task if it exists
    PeriodicTask.objects.filter(name="Feed Closing Balance").delete()

    # Create or get crontab schedule
    schedule, _ = CrontabSchedule.objects.get_or_create(
        minute="55",
        hour="23",  # 11:55 PM
        day_of_week="*",
        day_of_month="*",
        month_of_year="*",
    )

    # Create periodic task
    task = PeriodicTask.objects.create(
        crontab=schedule,
        name="Feed Closing Balance",
        task="api.tasks.feed_closing_balance",
    )

    print("Feed Closing Balance Task scheduled for 11:55 PM successfully.")
