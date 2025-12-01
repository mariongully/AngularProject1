import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { InstrumentService } from '../../services/instrument.service';
import '@agilent/awf-wc/button';
import '@agilent/awf-wc/input-text';
import '@agilent/awf-wc/title-bar';
import '@agilent/awf-wc/input-password';
import '@agilent/awf-wc/banner';
import { RunForm } from '../run-panel/run-panel';
import { Instrument } from '../instrument-list/instrument-list';

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
  instruments: Instrument[] = [];

  // Credentials editable in the UI, default values preserved
  username = 'admin';
  password = 'admin';

  // Selected instrument shown in the right panel after connect
  selectedInstrument: Instrument | null = null;

  // Default run form values (passed to RunPanel)
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

            // existing batching logic
            const ids = this.instruments.map(i => i.id).filter((v): v is number => typeof v === 'number');
            if (ids.length > 0) {
              this.instrumentService.getInstrumentsStatusByIds(ids, this.token).subscribe({
                next: (statusArray: any) => {
                  if (Array.isArray(statusArray)) {
                    for (const status of statusArray) {
                      const instrumentId = status?.instrumentId ?? status?.id;
                      const state = status?.hardwareStatus ?? status?.instrumentState ?? status?.state;
                      const inst = this.instruments.find(x => x.id === instrumentId || String(x.id) === String(instrumentId));
                      if (inst) {
                        inst.instrumentState = state ?? 'Unknown';
                        inst.stateLoading = false;
                      }
                    }
                    for (const inst of this.instruments) {
                      if (inst.stateLoading) {
                        inst.instrumentState = inst.instrumentState ?? 'Unknown';
                        inst.stateLoading = false;
                      }
                    }
                  } else {
                    this.refreshStatusesIndividually();
                  }
                },
                error: (err) => {
                  console.error('Batch status request failed, falling back to individual calls', err);
                  this.refreshStatusesIndividually();
                }
              });
            } else {
              this.refreshStatusesIndividually();
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

  // fallback per-instrument retrieval
  private refreshStatusesIndividually(): void {
    for (const inst of this.instruments) {
      this.instrumentService.getInstrumentStatus(inst.globalId, this.token).subscribe({
        next: (statusData: any) => {
          inst.instrumentState = statusData?.hardwareStatus ?? statusData?.instrumentState ?? 'Unknown';
          inst.stateLoading = false;
        },
        error: (err) => {
          inst.instrumentState = 'Unknown';
          inst.stateLoading = false;
          console.error('Error fetching instrument status:', inst.globalId, err);
        }
      });
    }
  }

  connectInstrument(instrument: Instrument): void {
    this.message = `Connecting to instrument "${instrument.name}"...`;
    instrument.stateLoading = true;

    this.instrumentService.initializeInstrument(instrument.globalId, this.token).subscribe({
      next: (res) => {
        // after initialize prefer batch endpoint using numeric id
        if (typeof instrument.id === 'number') {
          this.instrumentService.getInstrumentsStatusByIds([instrument.id], this.token).subscribe({
            next: (statusArray: any) => {
              if (Array.isArray(statusArray) && statusArray.length > 0) {
                const status = statusArray[0];
                instrument.instrumentState = status?.hardwareStatus ?? status?.instrumentState ?? 'Unknown';
                instrument.stateLoading = false;
                this.message = `Status updated for "${instrument.name}": ${instrument.instrumentState}`;
              } else if (statusArray && (statusArray.hardwareStatus || statusArray.instrumentState || statusArray.state)) {
                instrument.instrumentState = (statusArray.hardwareStatus ?? statusArray.instrumentState ?? statusArray.state) ?? 'Unknown';
                instrument.stateLoading = false;
                this.message = `Status updated for "${instrument.name}": ${instrument.instrumentState}`;
              } else {
                this.fallbackStatusByGlobalId(instrument);
              }
              this.selectedInstrument = instrument;
            },
            error: (err) => {
              console.error('Batch status after initialize failed, falling back', err);
              this.fallbackStatusByGlobalId(instrument);
              this.selectedInstrument = instrument;
            }
          });
        } else {
          this.fallbackStatusByGlobalId(instrument);
          this.selectedInstrument = instrument;
        }

        console.log('Initialize response:', res);
      },
      error: (err) => {
        instrument.stateLoading = false;
        this.message = `Error connecting to "${instrument.name}".`;
        console.error(err);
      }
    });
  }

  private fallbackStatusByGlobalId(instrument: Instrument) {
    this.instrumentService.getInstrumentStatus(instrument.globalId, this.token).subscribe({
      next: (st: any) => {
        instrument.instrumentState = st?.hardwareStatus ?? st?.instrumentState ?? 'Unknown';
        instrument.stateLoading = false;
        this.message = `Status updated for "${instrument.name}": ${instrument.instrumentState}`;
      },
      error: (err) => {
        instrument.instrumentState = 'Unknown';
        instrument.stateLoading = false;
        this.message = `Initialized but failed to retrieve status for "${instrument.name}".`;
        console.error(err);
      }
    });
  }

  // Handler invoked by RunPanelComponent
  onRunSubmit(form: RunForm): void {
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

    const payload = {
      runType: 'SingleRun',
      projectId: '56',
      resultPath: form.resultPath,
      resultFileName: form.resultFileName,
      isPriority: true,
      injectionLine: {
        type: 'SingleRunInjectionLine',
        sampleLocation: '1',
        injectionsPerSample: 1,
        sampleName: 'demo',
        methods: {
          acquisitionMethod: form.acquisitionMethod,
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
}
