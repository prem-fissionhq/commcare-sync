# Generated by Django 3.0.5 on 2020-05-14 12:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('commcare', '0005_auto_20200514_1153'),
        ('exports', '0002_multiprojectexportconfig'),
    ]

    operations = [
        migrations.CreateModel(
            name='MultiProjectExportRun',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('completed_at', models.DateTimeField(blank=True, null=True)),
                ('status', models.CharField(choices=[('started', 'started'), ('completed', 'completed'), ('failed', 'failed')], default='started', max_length=10)),
                ('log', models.TextField(blank=True, null=True)),
                ('export_config', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='runs', to='exports.MultiProjectExportConfig')),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='commcare.CommCareProject')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
