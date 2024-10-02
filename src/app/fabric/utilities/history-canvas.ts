declare const fabric: any;

class HistoryCanvas extends fabric.Canvas {
  historyUndo: string[] = [];
  historyRedo: string[] = [];
  historyNextState: string | null = null;
  historyProcessing: boolean = false;
  extraProps: string[] = ['selectable', 'editable'];

  constructor(element: HTMLCanvasElement | string, options?: fabric.ICanvasOptions) {
    super(element, options);
    this._historyInit();
  }

  // Initialize the history
  _historyInit() {
    this.historyUndo = [];
    this.historyRedo = [];
    this.historyNextState = this.getCurrentState();
    this["on"]('object:added', (e: any) => this.saveHistory(e));
    this["on"]('object:removed', (e: any) => this.saveHistory(e));
    this["on"]('object:modified', (e: any) => this.saveHistory(e));
    this["on"]('object:skewing', (e: any) => this.saveHistory(e));
  }

  // Dispose the history
  _historyDispose() {
    // Detach event listeners individually
    // Detach event listeners individually
    this["off"]('object:added', this.saveHistory);
    this["off"]('object:removed', this.saveHistory);
    this["off"]('object:modified', this.saveHistory);
    this["off"]('object:skewing', this.saveHistory);
  }

  // Get the current state of the canvas as a string
  getCurrentState(): string {
    return JSON.stringify(this["toDatalessJSON"](this.extraProps));
  }

  // Save the state of the canvas into history stack
  saveHistory(e: any) {
    if (this.historyProcessing) return;
    if (this.historyNextState) {
      this.historyUndo.push(this.historyNextState);
    }
    this.historyNextState = this.getCurrentState();
  }

  // Undo the latest action
  undo(callback?: () => void) {
    this.historyProcessing = true;

    const history = this.historyUndo.pop();
    if (history) {
      this.historyRedo.push(this.getCurrentState());
      this.historyNextState = history;
      this.loadHistory(history, 'history:undo', callback);
    } else {
      this.historyProcessing = false;
    }
  }

  // Redo the last undone action
  redo(callback?: () => void) {
    this.historyProcessing = true;

    const history = this.historyRedo.pop();
    if (history) {
      this.historyUndo.push(this.getCurrentState());
      this.historyNextState = history;
      this.loadHistory(history, 'history:redo', callback);
    } else {
      this.historyProcessing = false;
    }
  }

  // Load the given history state
  loadHistory(history: string, event: string, callback?: () => void) {
    this["loadFromJSON"](history, () => {
      this["renderAll"]();
      this["fire"](event);
      this.historyProcessing = false;
      if (callback) callback();
    });
  }

  // Clear undo and redo stacks
  clearHistory() {
    this.historyUndo = [];
    this.historyRedo = [];
    this["fire"]('history:clear');
  }

  // Enable history tracking
  onHistory() {
    this.historyProcessing = false;
    this.saveHistory({});
  }

  // Disable history tracking
  offHistory() {
    this.historyProcessing = true;
  }

  // Check if undo is possible
  canUndo(): boolean {
    return this.historyUndo.length > 0;
  }

  // Check if redo is possible
  canRedo(): boolean {
    return this.historyRedo.length > 0;
  }
}

export default HistoryCanvas;
