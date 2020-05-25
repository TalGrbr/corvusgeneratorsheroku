export class Page {
  name: string;
  color: string;
  title: string;
  about: string;
  remarks: Array<string>;
  showForm: boolean;

  constructor(options: {
                name?: string,
                color?: string,
                title?: string,
                about?: string,
                remarks?: Array<string>,
                showForm?: boolean
              } = {}) {
    this.name = options.name || 'PageName';
    this.color = options.color || '#000000';
    this.title = options.title || 'Page Title';
    this.about = options.about || 'Page Description';
    this.remarks = options.remarks || new Array<string>();
    this.showForm = options.showForm;
  }
}
