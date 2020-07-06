from django.utils import timezone

from celery import shared_task

from apps.exports.templatetags.dateformat_tags import readable_timedelta
from .models import ExportConfig, MultiProjectExportConfig
from .runner import run_export, run_multi_project_export


@shared_task(bind=True)
def run_all_exports_task(self):
    for export in ExportConfig.objects.filter(is_paused=False):
        run_export_task.delay(export.id, force=False)
    for multi_export in MultiProjectExportConfig.objects.filter(is_paused=False):
        run_multi_project_export.delay(multi_export.id, force=False)


@shared_task(bind=True)
def run_export_task(self, export_id, force):
    export = ExportConfig.objects.get(id=export_id)
    if export.is_scheduled_to_run():
        export_run = run_export(export, force)
        return {
            'run_time': export_run.created_at.isoformat(),
            'status': export_run.status,
            'duration': export_run.get_duration_display(),
            'log': export_run.log,
        }


@shared_task(bind=True)
def run_multi_project_export_task(self, export_id, force):
    run_start = timezone.now()
    export = MultiProjectExportConfig.objects.get(id=export_id)
    # todo: consolidate runs with more info
    export_run = run_multi_project_export(export, force)[-1]
    run_end = timezone.now()
    return {
        'run_time': export_run.created_at.isoformat(),
        'status': export_run.status,
        'duration': readable_timedelta(run_end - run_start),
        'log': export_run.log,
    }
