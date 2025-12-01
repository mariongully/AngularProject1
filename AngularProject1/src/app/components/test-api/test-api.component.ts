import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { InstrumentService } from '../../services/instrument.service';
import '@agilent/awf-wc/button'; 
import '@agilent/awf-wc/input-text'; 
import '@agilent/awf-wc/title-bar';
import '@agilent/awf-wc/input-password';
import '@agilent/awf-wc/banner';

@Component({
  selector: 'app-test-api',
  templateUrl: './test-api.html',
  standalone: false,
  styleUrls: ['./test-api.css'],
})
export class TestApi {
  isLoading = false;
  message = '';
  token = '';
  instruments: { id?: number; name: string; globalId: string; instrumentState?: string; stateLoading?: boolean }[] = [];

  // Credentials editable in the UI, default values preserved
  username = 'admin';
  password = 'admin';

  // Selected instrument shown in the right panel after connect
  selectedInstrument: { id?: number; name: string; globalId: string; instrumentState?: string; stateLoading?: boolean } | null = null;

  // Run form fields (editable by user)
  resultFileName = 'test1';
  acquisitionMethod = 'C:\\Enterprise\\Projects\\TestSCP\\Methods\\dp.amx';
  resultPath = 'C:\\Enterprise\\Projects\\TestSCP\\Results';
  runInProgress = false;

  constructor(
    private authService: AuthService,
    private instrumentService: InstrumentService
  ) { }

  start(): void {
    this.isLoading = true;
    this.message = 'Connecting...';

    // Pass user-provided credentials (defaults used if unchanged)
    this.authService.login(this.username, this.password).subscribe({
      next: (rawToken: string) => {
        this.token = rawToken.replace(/"/g, '');
        this.message = 'Connected. Retrieving instruments...';

        this.instrumentService.getInstruments(this.token).subscribe({
          next: (data) => {
            this.instruments = data.instruments.map((i: any) => ({
              id: i.id,
              name: i.name,
              globalId: i.globalId,
              instrumentState: 'Unknown',
              stateLoading: true
            }));

            // For each instrument, request its status and update the state
            for (const inst of this.instruments) {
              this.instrumentService.getInstrumentStatus(inst.globalId, this.token).subscribe({
                next: (statusData: any) => {
                  inst.instrumentState = statusData?.instrumentState ?? 'Unknown';
                  inst.stateLoading = false;
                },
                error: (err) => {
                  inst.instrumentState = 'Unknown';
                  inst.stateLoading = false;
                  console.error('Error fetching instrument status:', inst.globalId, err);
                }
              });
            }

            this.message = `${this.instruments.length} instrument(s) found.`;
            this.isLoading = false;
          },
          error: (err) => {
            this.message = 'Error fetching instruments.';
            this.isLoading = false;
            console.error(err);
          }
        });
      },
      error: (err) => {
        this.message = 'Error during login.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  connectInstrument(instrument: { id?: number; name: string; globalId: string; instrumentState?: string; stateLoading?: boolean }): void {
    this.message = `Connecting to instrument "${instrument.name}"...`;
    instrument.stateLoading = true;

    this.instrumentService.initializeInstrument(instrument.globalId, this.token).subscribe({
      next: (res) => {
        // After successful initialize, request status and update the instrument state
        this.message = `Instrument "${instrument.name}" initialized successfully. Retrieving status...`;
        this.instrumentService.getInstrumentStatus(instrument.globalId, this.token).subscribe({
          next: (statusData: any) => {
            instrument.instrumentState = statusData?.instrumentState ?? 'Unknown';
            instrument.stateLoading = false;
            this.message = `Status updated for "${instrument.name}": ${instrument.instrumentState}`;

            // Set as selected instrument when connect completes
            this.selectedInstrument = instrument;
          },
          error: (err) => {
            instrument.instrumentState = 'Unknown';
            instrument.stateLoading = false;
            this.message = `Initialized but failed to retrieve status for "${instrument.name}".`;
            console.error(err);
            // still select instrument even if status failed
            this.selectedInstrument = instrument;
          }
        });
        console.log('Initialize response:', res);
      },
      error: (err) => {
        instrument.stateLoading = false;
        this.message = `Error connecting to "${instrument.name}".`;
        console.error(err);
      }
    });
  }

  submitRun(): void {
    if (!this.selectedInstrument) {
      this.message = 'No instrument selected.';
      return;
    }
    if (!this.token) {
      this.message = 'Missing token. Please log in again.';
      return;
    }

    this.runInProgress = true;
    this.message = `Submitting run to "${this.selectedInstrument.name}"...`;

    // Build the payload following the example structure
    const payload = {
      runType: 'SingleRun',
      projectId: '56',
      resultPath: this.resultPath,
      resultFileName: this.resultFileName,
      isPriority: true,
      injectionLine: {
        type: 'SingleRunInjectionLine',
        sampleLocation: '1',
        injectionsPerSample: 1,
        sampleName: 'demo',
        methods: {
          acquisitionMethod: this.acquisitionMethod,
          processingMethod: '',
          samplePrepMethod: ''
        },
        injectionVolume: 1.0,
        selectedInjection: {
          displayName: 'Standard',
          id: 'Front',
          deviceId: 'data player#0#1',
          supportsUseMethodVolume: true,
          supportsSamplePrep: false,
          supportsMultiInject: false,
          supportsBarcodeDrivenInjections: false,
          supportsSampleContainer: false,
          sampleContainerXmls: [],
          removeSampleContainerContent: false,
          sampleContainerDeviceXml: ''
        },
        useMethodInjectionVolume: true,
        sampleAmount: 12.99,
        sampleDescription: 'string',
        internalStandards: {
          internalStandard1: 999999999.99999,
          internalStandard2: 999999999.99999,
          internalStandard3: 999999999.99999,
          internalStandard4: 999999999.99999,
          internalStandard5: 999999999.99999
        },
        sampleType: 'Sample'
      }
    };

    this.instrumentService.submitRun(this.selectedInstrument.globalId, this.token, payload).subscribe({
      next: (res) => {
        this.runInProgress = false;
        this.message = `Run submitted successfully on "${this.selectedInstrument!.name}".`;
        console.log('Run submit response:', res);
      },
      error: (err) => {
        this.runInProgress = false;
        this.message = `Error submitting run for "${this.selectedInstrument!.name}".`;
        console.error('Run submit error:', err);
      }
    });
  }

  // Maps instrumentState string to a CSS class
  getStateClass(state?: string): string {
    if (!state) { return 'state-unknown'; }
    switch ((state || '').toLowerCase()) {
      case 'offline': return 'state-offline';
      case 'idle': return 'state-idle';
      case 'error': return 'state-error';
      case 'notready': return 'state-notready';
      case 'not ready': return 'state-notready';
      default: return 'state-unknown';
    }
  }
}
