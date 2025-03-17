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

@Component({
  selector: 'app-messages',
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    DatePipe
  ],
  standalone: true,
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
})
export class MessagesComponent implements OnInit, OnDestroy {
  private messagesStore = inject(MessagesStore);
  loading = this.messagesStore.loading;
  displayedColumns: string[] = ['id', 'email', 'message', 'date'];
  dataSource = new MatTableDataSource<any>([]);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dialog: MatDialog) {
    effect(() => {
      this.dataSource.data = this.messagesStore.messages();
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  ngOnInit(): void {
    this.messagesStore.loadMessages();

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.messagesStore.cleanup();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Form submitted:', result);
        // Handle form submission here
      }
    });
  }
}