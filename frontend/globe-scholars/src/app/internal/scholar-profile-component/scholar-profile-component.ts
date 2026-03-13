import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {ScholarsService} from '../../services/scholars/scholars-service';
import {Scholar} from '../../services/scholars/scholar.model';
import {RepositoryService} from '../../services/repository/repository-service';
import {WorkSummary} from '../../services/repository/work.model';
import {ModalComponent} from '../../shared/modal-component/modal-component';

@Component({
  selector: 'app-scholar-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ModalComponent],
  templateUrl: './scholar-profile-component.html',
  styleUrl: './scholar-profile-component.scss',
})
export class ScholarProfileComponent implements OnInit {
  scholar: Scholar | null = null;
  isLoading = true;
  error: string | null = null;
  works: WorkSummary[] = [];
  worksLoading = true;
  showConfirmationModal = false;
  workToDelete: number | null = null;

  get currentUsername(): string | null {
    return sessionStorage.getItem('username');
  }

  constructor(
    private route: ActivatedRoute,
    private scholarsService: ScholarsService,
    private repositoryService: RepositoryService,
  ) {
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.scholarsService.getScholarById(id).subscribe({
      next: (data) => {
        this.scholar = data;
        this.isLoading = false;
        this.loadWorks(data.id);
      },
      error: () => {
        this.error = 'Failed to load scholar profile.';
        this.isLoading = false;
      }
    });
  }

  getYear(date: Date): number {
    return new Date(date).getFullYear();
  }

  copied = false;

  copyProfileLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      this.copied = true;
      setTimeout(() => this.copied = false, 2000);
    });
  }

  downloadProfile() {
    if (!this.scholar) return;

    this.scholarsService.exportScholar(this.scholar.id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.scholar!.fullName}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      },
      error: () => {
        console.error('Failed to download profile');
      }
    });
  }

  loadWorks(uploaderId: number) {
    this.repositoryService.getWorksByUploader(uploaderId).subscribe({
      next: (data) => {
        this.works = data;
        this.worksLoading = false;
      },
      error: () => {
        this.worksLoading = false;
      }
    })
  }

  confirmDelete(id: number) {
    this.workToDelete = id;
    this.showConfirmationModal = true;
  }

  onDeleteConfirmed() {
    if (this.workToDelete === null) return;
    this.repositoryService.deleteWork(this.workToDelete).subscribe({
      next: () => {
        this.works = this.works.filter(w => w.id !== this.workToDelete);
        this.showConfirmationModal = false;
        this.workToDelete = null;
        alert('Deleted Successfully')
      },
      error: () => {
        alert('Failed to delete file');
        this.showConfirmationModal = false;
        this.workToDelete = null;
      }
    });
  }
}
