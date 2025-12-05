import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { InstrumentService } from '../../services/instrument.service';
import '@agilent/awf-wc/button';
import '@agilent/awf-wc/input-text';
import '@agilent/awf-wc/title-bar';
import '@agilent/awf-wc/input-password';
import '@agilent/awf-wc/banner';
//import '@agilent/ui-template/login-page';
import { RunForm } from '../run-panel/run-panel';
import { Instrument } from '../instrument-list/instrument-list';
import { Project } from '../project-list/project-list';

@Component({
  selector: 'app-test-api',
  templateUrl: './test-api.html',
  standalone: false,
  styleUrls: ['./test-api.css'],
})
export class TestApi {
  isLoading = false;
  message: string[] = [];
  token = '';
  instruments: Instrument[] = [];
  projects: Project[] = [];

  // Credentials editable in the UI, default values preserved
  username = 'admin';
  password = 'admin';

  // Selected instrument shown in the right panel after connect
  selectedInstrument: Instrument | null = null;
  selectedProject: Project | null = null;

  // Default run form values (passed to RunPanel)
  resultFileName = 'test1';
  acquisitionMethod = 'C:\\CDSProjects\\DataPlayerProject\\Methods\\dp.amx';
  resultPath = 'C:\\CDSProjects\\DataPlayerProject\\Results';
  runInProgress = false;
  activeTab = 'home';

  //// Properties used by <ag-login-page>
  //productName = 'Agilent Control Panel';
  //// Use the existing asset that's referenced in the nav bar; could be an SVG URL or data URI
  //productIcon = 'data:image/png;base64,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';
  //loginPrompt = 'Sign in with your credentials to access the control panel.';
  //loginFooterText = 'Need help? Contact your administrator.';
  //// Allowed domains for login (adjust for your environment). Empty array = no domain restriction.
  //validDomains: string[] = ["AGILENT", "SID"];
  //isChangePassword = false;

  setActive(tab: string): void {
    this.activeTab = tab;
  }

  constructor(
    private authService: AuthService,
    private instrumentService: InstrumentService
  ) { }

  //// Handlers for the ag-login-page events
  //changePasswordAction(event: any): void {
  //  console.log('changePasswordAction', event);
  //  this.message = 'Change password requested.';
  //}

  //closeAction(event: any): void {
  //  console.log('closeAction', event);
  //  this.message = 'Login dialog closed.';
  //}

  //loginAction(event: any): void {
  //  console.log('loginAction', event);
  //  // ag-login-page may emit credentials in the event; fallback to UI fields if not present.
  //  const incomingUsername = event?.username ?? this.username;
  //  const incomingPassword = event?.password ?? this.password;
  //  this.username = incomingUsername;
  //  this.password = incomingPassword;

  //  // Start the same login flow as the manual login button
  //  this.start();
  //}


  start(): void {
    this.isLoading = true;
    this.message.push('Connecting...');

    this.authService.login(this.username, this.password).subscribe({
      next: (rawToken: string) => {
        this.token = rawToken.replace(/"/g, '');
        this.message.push('Connected. Retrieving projects...');

        this.instrumentService.getProject(this.token).subscribe({
          next: (data) => {
            this.projects = data.projects.map((i: any) => ({
              id: i.id,
              name: i.name,
              globalId: i.globalId,
            }));
          },
        error: (err) => {
          this.message.push('Error fetching projects.');
            this.isLoading = false;
            console.error(err);
          }
      });

        this.message.push('Connected. Retrieving instruments...');

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

            this.message.push(`${this.instruments.length} instrument(s) found.`);
            this.isLoading = false;
          },
          error: (err) => {
            this.message.push('Error fetching instruments.');
            this.isLoading = false;
            console.error(err);
          }
        });
      },
      error: (err) => {
        this.message.push('Error during login.');
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
    //if (!this.selectedProject) {
    //  this.message = 'No project selected.';
    //  return;
    //}

    this.message.push(`Connecting to instrument "${instrument.name}"...`);
    instrument.stateLoading = true;

    this.instrumentService.initializeInstrument(instrument.globalId, this.token).subscribe({
      next: (res) => {
        this.getStatusById(instrument);
        console.log('Initialize response:', res);
      },
      error: (err) => {
        instrument.stateLoading = false;
        this.message.push(`Error connecting to "${instrument.name}".`);
        console.error(err);
      }
    });
  }

  private getStatusById(instrument: Instrument) {

  // after initialize prefer batch endpoint using numeric id
  if (typeof instrument.id === 'number') {
    this.instrumentService.getInstrumentsStatusByIds([instrument.id], this.token).subscribe({
      next: (statusArray: any) => {
        if (Array.isArray(statusArray) && statusArray.length > 0) {
          const status = statusArray[0];
          instrument.instrumentState = status?.hardwareStatus ?? status?.instrumentState ?? 'Unknown';
          instrument.stateLoading = false;
          this.message.push(`Status updated for "${instrument.name}": ${instrument.instrumentState}`);
        } else if (statusArray && (statusArray.hardwareStatus || statusArray.instrumentState || statusArray.state)) {
          instrument.instrumentState = (statusArray.hardwareStatus ?? statusArray.instrumentState ?? statusArray.state) ?? 'Unknown';
          instrument.stateLoading = false;
          this.message.push(`Status updated for "${instrument.name}": ${instrument.instrumentState}`);
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

  }

  private fallbackStatusByGlobalId(instrument: Instrument) {
    this.instrumentService.getInstrumentStatus(instrument.globalId, this.token).subscribe({
      next: (st: any) => {
        instrument.instrumentState = st?.hardwareStatus ?? st?.instrumentState ?? 'Unknown';
        instrument.stateLoading = false;
        this.message.push(`Status updated for "${instrument.name}": ${instrument.instrumentState}`);
      },
      error: (err) => {
        instrument.instrumentState = 'Unknown';
        instrument.stateLoading = false;
        this.message.push(`Initialized but failed to retrieve status for "${instrument.name}".`);
        console.error(err);
      }
    });
  }

  // Handler invoked by RunPanelComponent
  onRunSubmit(form: RunForm): void {
    if (!this.selectedInstrument) {
      this.message.push('No instrument selected.');
      return;
    }
    if (!this.token) {
      this.message.push('Missing token. Please log in again.');
      return;
    }

    this.runInProgress = true;
    this.message.push(`Submitting run to "${this.selectedInstrument.name}"...`);

    const payload = {
      type: 'SingleRun',
      projectId: '15',
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
        this.message.push(`Run submitted successfully on "${this.selectedInstrument!.name}".`);
        console.log('Run submit response:', res);
      },
      error: (err) => {
        this.runInProgress = false;
        this.message.push(`Error submitting run for "${this.selectedInstrument!.name}".`);
        console.error('Run submit error:', err);
      }
    });
  }

  // Handler for project selection from the child component
  selectProject(project: Project): void {
    this.selectedProject = project;
    this.message.push(`Selected project: ${project.name}`);
    console.log('Project selected:', project);
  }
}
