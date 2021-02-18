import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Place } from 'src/app/places/places.model';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPalce: Place;
  @Input() selectedMode: 'select' | 'random';
  startDate: string;
  endDate: string;
  @ViewChild('f', { static: true }) form: NgForm;
  constructor(private modalController: ModalController) {}

  ngOnInit() {
    const availableFrom = new Date(this.selectedPalce.availableFrom);
    const availableTo = new Date(this.selectedPalce.availableTo);
    console.log(this.selectedMode);
    if (this.selectedMode === 'random') {
      this.startDate = new Date(
        availableFrom.getTime() +
          Math.random() *
            (availableTo.getTime() -
              7 * 24 * 60 * 60 * 1000 -
              availableFrom.getTime())
      ).toISOString();
      this.endDate = new Date(
        new Date(this.startDate).getTime() +
          Math.random() *
            (new Date(this.startDate).getTime() +
              6 * 24 * 60 * 60 * 1000 -
              new Date(this.startDate).getTime())
      ).toISOString();
    }
  }

  onBookPlace() {
    if (!this.form.valid || !this.datesValid) {
      return;
    }

    this.modalController.dismiss(
      {
        bookingData: {
          firstName: this.form.value['first-name'],
          lastName: this.form.value['last-name'],
          guestNumber: +this.form.value['guest-number'],
          startDate: new Date(this.form.value['date-from']),
          endDate: new Date(this.form.value['date-to']),
        },
      },
      'confirm'
    );
  }

  onCancel() {
    this.modalController.dismiss(null, 'cancel');
  }

  datesValid() {
    const startDate = this.form.value['date-from'];
    const endDate = this.form.value['date-to'];

    return endDate > startDate;
  }
}
