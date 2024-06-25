import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ExpenseService } from '../services/expense.service';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss'
})
export class TodoComponent implements OnInit  {
  todoForm: any;
  selectedMonth: string = '';
  monthSelected: boolean = false;
  userId: number = 1;
  expenses: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private expenseService: ExpenseService
  ) { }

  ngOnInit(): void {
    this.todoForm = this.fb.group({
      month: ['', Validators.required],
      expenseType: ['', Validators.required],
      expenseAmount: ['', Validators.required]
    });
  }

  onSubmitExpense() {
    if (this.todoForm.valid) {
      const newExpense = { ...this.todoForm.value, userId: this.userId };
      this.expenseService.addExpense(newExpense).subscribe(
        (response: any) => {
          this.getExpenses();
        },
        (error) => {
          console.error('Error adding expense:', error);
        }
      );
      this.todoForm.reset();
    }
  }

  onChangeExpense(event: any) {
    this.selectedMonth = event.target.value;
    this.monthSelected = true;
    this.getFilteredExpenses();
  }

  getExpenses() {
    this.expenseService.getExpenses(this.userId).subscribe(
      (response: any) => {
        this.expenses = response;
      },
      (error) => {
        console.error('Error fetching expenses:', error);
      }
    );
  }

  getFilteredExpenses() {
    return this.expenses.filter(expense => expense.month === this.selectedMonth);
  }

  calculateTotalExpense(month: string): number {
    return this.expenses
      .filter(expense => expense.month === month)
      .reduce((total, expense) => total + expense.expenseAmount, 0);
  }

  onBack() {
    this.router.navigate(['/budget-planner/dashboard']);
  }

  saveForm() {
    console.log("Form saved!");
  }
  toggleSelection(expense: any) {
    expense.selected = !expense.selected;}

}