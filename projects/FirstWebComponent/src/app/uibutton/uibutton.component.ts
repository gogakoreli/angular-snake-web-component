import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-uibutton',
  templateUrl: './uibutton.component.html',
  styleUrls: ['./uibutton.component.scss']
})
export class UIButtonComponent implements OnInit {

  @Input() label: string;

  constructor() { }

  ngOnInit(): void {
  }

} 
