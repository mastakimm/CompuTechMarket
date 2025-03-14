import {Component, Inject} from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-delete-success-dialog',
  template: `
    <div class="p-4">
      <mat-dialog-content>
        <p>Etes-vous sur de vouloir supprimer le produit : {{data.name}}?</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end" class="flex gap-3">
        <button mat-button (click)="onNoClick()">No</button>
        <button mat-button (click)="onYesClick()">Yes</button>
      </mat-dialog-actions>
    </div>
  `,
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatButton,
  ],
  standalone: true
})
export class DeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.dialogRef.close('yes');
  }
}
