# Generated by Django 3.0.5 on 2020-07-21 08:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('exports', '0009_auto_20200721_1039'),
    ]

    operations = [
        migrations.CreateModel(
            name='MultiProjectExportRun',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('completed_at', models.DateTimeField(blank=True, null=True)),
                ('triggered_from_ui', models.NullBooleanField(default=None)),
                ('status', models.CharField(choices=[('started', 'started'), ('completed', 'completed'), ('failed', 'failed')], default='started', max_length=10)),
                ('log', models.TextField(blank=True, null=True)),
                ('export_config', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='runs_new', to='exports.MultiProjectExportConfig')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='multiprojectpartialexportrun',
            name='parent_run',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='exports.MultiProjectExportRun'),
        ),
    ]
