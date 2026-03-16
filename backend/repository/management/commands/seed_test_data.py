import os

from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from django.contrib.auth import get_user_model
from repository.models import ScholarlyWork

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates test user with test data for e2e tests'

    def handle(self, *args, **kwargs):
        for i in range(10):

            user, created = User.objects.get_or_create(
                username=f"testuser{i}",
                defaults={
                    'email': f'testuser{i}@test.com',
                    'first_name': 'Test',
                    'last_name': f'User{i}',
                    'bio': 'Test bio',
                    'affiliation': 'Test University',
                    'country': 'Germany',
                }
            )
            if created:
                user.set_password('TestPass123!')
                user.save()
                self.stdout.write(self.style.SUCCESS(f'Created testuser{i}'))
            else:
                self.stdout.write(f'testuser{i} already exists')

        fixtures_dir = os.path.join(os.path.dirname(__file__), 'fixtures')
        pdf_path = os.path.join(fixtures_dir, 'test.pdf')

        with open(pdf_path, 'rb') as f:
            pdf_content = f.read()

        work1, created = ScholarlyWork.objects.get_or_create(
            title='Test Work One',
            uploader=user,
            defaults={
                'authors': 'Test User0',
                'publication_year': 2024,
                'description': 'Test description',
                'file_type': 'pdf',
                'file_size': len(pdf_content),
                'conversion_status': 'completed',
                'original_filename': 'test.pdf',
            }
        )
        if created:
            work1.file.save('test_work_one.pdf', ContentFile(pdf_content), save=True)
            self.stdout.write(self.style.SUCCESS(f'Created work1: id={work1.id}'))
        else:
            if not work1.file:
                work1.file.save('test_work_one.pdf', ContentFile(pdf_content), save=True)
                self.stdout.write(self.style.SUCCESS(f'Fixed file for work1: id={work1.id}'))
            else:
                self.stdout.write(f'work1 already exists: id={work1.id}')

        self.stdout.write(self.style.SUCCESS('Seed complete'))
        self.stdout.write(f'testuser work id: {work1.id}')
