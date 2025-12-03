import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { InstrumentService } from '../../services/instrument.service';
import { interval, of, Subscription } from 'rxjs';
import { startWith, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-run-queue',
  templateUrl: './run-queue.html',
  standalone: false,
  styleUrls: ['./run-queue.css', '../test-api/test-api.css']
})
export class RunQueueComponent implements OnChanges, OnDestroy {
  // Accept undefined as well to match template bindings
  @Input() globalId: string | null | undefined = null;
  @Input() token = '';

  // Poll interval in milliseconds (default 5000 ms)
  @Input() pollInterval = 5000;

  runQueue: any[] = [];
  loading = false;

  private pollingSub?: Subscription;

  constructor(private instrumentService: InstrumentService) { }

  ngOnChanges(changes: SimpleChanges): void {
    // Use bracket notation for SimpleChanges keys to avoid index-signature complaints
    if (changes['globalId'] || changes['token'] || changes['pollInterval']) {
      this.restartPolling();
    }
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  private restartPolling(): void {
    this.stopPolling();

    if (!this.globalId || !this.token) {
      // show dummy when not connected so you can see the layout
      this.runQueue = [this.getDummyRecord()];
      return;
    }

    this.loading = true;
    // interval + startWith(0) to fetch immediately, then every pollInterval ms
    this.pollingSub = interval(this.pollInterval).pipe(
      startWith(0),
      switchMap(() => {
        if (!this.globalId || !this.token) {
          return of(null);
        }
        return this.instrumentService.getRunQueue(this.globalId, this.token).pipe(
          catchError(err => {
            console.error('Run queue fetch error (caught):', err);
            return of(null);
          })
        );
      })
    ).subscribe({
      next: (data) => {
        const records = data?.runRecords ?? [];
        if (!records || records.length === 0) {
          // when there are no real runs, show a dummy example record
          this.runQueue = [this.getDummyRecord()];
        } else {
          this.runQueue = records;
        }
        this.loading = false;
      },
      error: (err) => {
        // Should be caught above, but safeguard here as well
        console.error('Run queue polling error:', err);
        this.runQueue = [this.getDummyRecord()];
        this.loading = false;
      }
    });
  }

  private stopPolling(): void {
    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
      this.pollingSub = undefined;
    }
  }

  // Returns a small dummy record for visual purposes
  private getDummyRecord() {
    return {
      id: '__dummy__',
      userName: 'example.user',
      userConfiguredName: 'Example User',
      resultFileName: 'example_result_001',
      sampleRunType: 'SingleRun',
      status: 'Pending',
      isPriority: false,
      projectId: 'demo',
      handledBy: null,
      sampleName: 'Sample A',
      location: 'Slot 1',
      details: {},
      submissionDate: new Date().toLocaleString(),
      isDummy: true
    };
  }
}
