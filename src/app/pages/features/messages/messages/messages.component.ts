import { Component, OnInit, OnDestroy, ViewChild, inject, effect } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe } from '@angular/common';
import { MessagesStore } from '../../../../../core/store/messages.store';
import { MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';
import { Subject, takeUntil } from 'rxjs';
import { MessagesFacade } from '../../../../../core/store/messages.facade';

@Component({
  selector: 'app-messages',
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSortModule,
    DatePipe
  ],
  standalone: true,
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
})
export class MessagesComponent implements OnInit, OnDestroy {
  loading = false;
  displayedColumns: string[] = ['id', 'email', 'message', 'date'];
  dataSource = new MatTableDataSource<any>([]);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private destroy$ = new Subject<void>();
  
  constructor(private dialog: MatDialog, private messagesFacade: MessagesFacade) {
    this.messagesFacade.messages$
    .pipe(takeUntil(this.destroy$))
    .subscribe(messages => {
      this.dataSource.data = messages;
      setTimeout(() => { 
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
      })
    });
    this.messagesFacade.loading$
    .pipe(takeUntil(this.destroy$))
    .subscribe(loading => {
      this.loading = loading;
    });
  }

  ngOnInit(): void {
    this.messagesFacade.loadMessages();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.messagesFacade.cleanup();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      width: '500px',
      panelClass: 'rounded-dialog'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Form submitted:', result);
      }
    });
  }
}