interface PerformanceBudget {
  type: 'render' | 'memory' | 'network';
  threshold: number;
  component?: string;
}

interface BudgetViolation {
  budget: PerformanceBudget;
  actual: number;
  timestamp: number;
  component: string;
}

class PerformanceBudgetMonitor {
  private budgets: PerformanceBudget[] = [];
  private violations: BudgetViolation[] = [];
  private violationCallbacks: ((violation: BudgetViolation) => void)[] = [];

  addBudget(budget: PerformanceBudget) {
    this.budgets.push(budget);
  }

  removeBudget(type: string, component?: string) {
    this.budgets = this.budgets.filter(
      b => !(b.type === type && b.component === component)
    );
  }

  getBudgets(): PerformanceBudget[] {
    return [...this.budgets];
  }

  getViolations(component?: string): BudgetViolation[] {
    return component
      ? this.violations.filter(v => v.component === component)
      : [...this.violations];
  }

  onViolation(callback: (violation: BudgetViolation) => void) {
    this.violationCallbacks.push(callback);
  }

  checkBudget(type: 'render' | 'memory' | 'network', component: string, value: number) {
    const budget = this.budgets.find(
      b => b.type === type && (!b.component || b.component === component)
    );

    if (budget && value > budget.threshold) {
      const violation: BudgetViolation = {
        budget,
        actual: value,
        timestamp: Date.now(),
        component
      };

      this.violations.push(violation);
      // Keep only last 100 violations
      if (this.violations.length > 100) {
        this.violations.shift();
      }

      // Notify callbacks
      this.violationCallbacks.forEach(callback => callback(violation));

      return violation;
    }

    return null;
  }

  clearViolations() {
    this.violations = [];
  }
}

export const performanceBudgetMonitor = new PerformanceBudgetMonitor();

// Initialize with some default budgets
performanceBudgetMonitor.addBudget({
  type: 'render',
  threshold: 16, // 60fps target
  component: undefined // Global budget
});

performanceBudgetMonitor.addBudget({
  type: 'memory',
  threshold: 50 * 1024 * 1024, // 50MB
  component: undefined
});

performanceBudgetMonitor.addBudget({
  type: 'network',
  threshold: 1000, // 1 second
  component: undefined
});

// Add violation handler for logging
performanceBudgetMonitor.onViolation((violation) => {
  console.warn(
    `Performance budget violation in ${violation.component}:`,
    `${violation.actual}${violation.budget.type === 'memory' ? 'MB' : 'ms'}`,
    `exceeds ${violation.budget.threshold}${violation.budget.type === 'memory' ? 'MB' : 'ms'}`
  );
});
