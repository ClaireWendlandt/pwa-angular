import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-quotes',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './quotes.component.html',
  styleUrl: './quotes.component.scss',
})
export class QuotesComponent implements OnInit {
  primaryColor = '#f0f4ff';
  categories = [
    'alone',
    'amazing',
    'art',
    'attitude',
    'best',
    'business',
    'change',
    'communication',
    'computers',
    'cool',
    'courage',
    'death',
    'design',
    'dreams',
    'environmental',
    'equality',
    'experience',
    'failure',
    'faith',
    'family',
    'famous',
    'fear',
    'food',
    'forgiveness',
    'freedom',
    'friendship',
    'funny',
    'future',
    'god',
    'good',
    'great',
    'happiness',
    'health',
    'history',
    'hope',
    'humor',
    'imagination',
    'inspirational',
    'intelligence',
    'knowledge',
    'leadership',
    'learning',
    'life',
    'love',
    'money',
    'movies',
    'success',
  ];
  constructor() {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  getRandomQuote() {}

  getDynamicColor() {
    this.primaryColor = `hsl(${Math.floor(Math.random() * 720)}, 50%, 80%)`;
  }
}
