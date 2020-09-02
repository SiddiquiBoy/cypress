import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, OnDestroy, Input, OnChanges } from '@angular/core';
import { FileUploadService } from './services/file-upload.service';
import { NzMessageService, UploadFile, UploadChangeParam, UploadXHRArgs } from 'ng-zorro-antd';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FileUploadComponent implements OnInit, OnDestroy, OnChanges {

  @Input() imageUrl: string;
  @Input() uploadText = 'Upload Image';
  @Input() uploadHint = 'Drag and Drop an image file';

  _multiple = false;
  @Input() set multiple(multiple: boolean) {
    this._multiple = multiple;
    if (multiple) {
      // this.setShowUploadList();
    } else {
      // do nothing
    }
  }

  get multiple() {
    return this._multiple;
  }

  @Output() emitImageUrl = new EventEmitter<any>();
  @Output() eEmitImageUrls = new EventEmitter<any>();
  @Output() emitImageLoadingStatus = new EventEmitter<boolean>();

  isSpinning = false;
  images: any[] = []; // List of images to be displayed under upload box.
  avatarUrl: string;
  avatarUrls: string[] = [];
  // file: any;
  // files: any[] = [];
  file: UploadFile;
  files: UploadFile[] = [];
  subscriptions: Subscription[] = [];
  firstLoad = true;
  showUploadList: any;

  customReq = (item: UploadXHRArgs) => {
    if (this.multiple) {
      this.files.push(item.file);
    } else {
      this.file = item.file;
    }
    // Always returns a `Subscription` object. nz-upload would automatically unsubscribe it at correct time.
    return new Subscription();
  }

  constructor(
    private fileUploadService: FileUploadService,
    private msg: NzMessageService,
  ) { }

  ngOnChanges() {
    if (this.imageUrl) {
      if (this.multiple) {
        this.avatarUrls.push(this.imageUrl);
      } else {
        this.avatarUrl = this.imageUrl;
      }
      // Add metadata to already uploaded images
      if (this.firstLoad) {
        this.updateImageMeta();
        this.firstLoad = false;
      }
    }
  }

  ngOnInit() { }

  setShowUploadList() {
    this.showUploadList = {
      showPreviewIcon: true,
      showRemoveIcon: true,
      hidePreviewIconInNonImage: true
    };
  }

  handleChange({ file, fileList }: UploadChangeParam): void {
    if (file.status === 'uploading') {
      file.status = 'done';
    }
    if (file.status === 'removed') {
      this.images = [];
      this.avatarUrl = '';
      this.avatarUrls = [];
      this.emitImageUrl.emit(this.avatarUrl);
      this.eEmitImageUrls.emit(this.avatarUrls);
    } else {
      this.isSpinning = true;
      this.emitImageLoadingStatus.emit(this.isSpinning);
      if (fileList.length > 1) {
        if (this.multiple) {
          // do nothing
        } else {
          fileList.shift();
        }
      } else {
        // do nothing
      }
      this.images = fileList;
      const formData = new FormData();
      if ((this.multiple && this.files.length === this.images.length) || !this.multiple) {
        formData.append('file', this.multiple ? this.files[this.files.length - 1] as any : this.file as any);
        this.subscriptions.push(
          this.fileUploadService.upload(formData).subscribe(
            (response: any) => {
              if (response && response[0] && response[0].file) {
                if (this.multiple) {
                  this.avatarUrls.push(response[0].file);
                  this.eEmitImageUrls.emit(this.avatarUrls);
                } else {
                  this.avatarUrl = response[0].file;
                  this.emitImageUrl.emit(this.avatarUrl);
                }
              } else {
                this.images = [];
                this.files = [];
                this.isSpinning = false;
                this.emitImageLoadingStatus.emit(this.isSpinning);
                this.msg.error(`Something went wrong!`);
              }
            },
            (error: any) => {
              this.images = [];
              this.isSpinning = false;
              this.emitImageLoadingStatus.emit(this.isSpinning);
              this.msg.error(`Something went wrong. Please try again`);
            }
          )
        );
      } else {

      }
    }
  }

  updateImageMeta() {
    this.images = [{
      id: 1,
      name: this.avatarUrl.split('/').pop()
    }];
  }

  imageLoaded() {
    this.isSpinning = false;
    this.emitImageLoadingStatus.emit(this.isSpinning);
    // Property 'type' is only present in images uploaded from local system
    if (this.images.length && this.images[0].type) {
      if (this.multiple) {
        this.msg.success(`${this.images[this.images.length - 1].name} file uploaded successfully.`);
      } else {
        this.msg.success(`${this.images[0].name} file uploaded successfully.`);
      }
    }
  }

  onImageLoad(index: number) {
    this.isSpinning = false;
    this.emitImageLoadingStatus.emit(this.isSpinning);
    // Property 'type' is only present in images uploaded from local system
    if (this.images.length && this.images[0].type) {
      if (this.multiple) {
        this.msg.success(`${this.images[index].name} file uploaded successfully.`);
      } else {
        this.msg.success(`${this.images[0].name} file uploaded successfully.`);
      }
    }
  }

  removeImage(index: number) {
    if (index !== undefined && index !== null) {
      if (this.files && this.files[index] && this.images && this.images[index] && this.avatarUrls && this.avatarUrls[index]) {
        this.files.splice(index, 1);
        this.images.splice(index, 1);
        this.avatarUrls.splice(index, 1);
        this.eEmitImageUrls.emit(this.avatarUrls);
      } else {
        // do nothing
      }
    } else {
      // do nothing
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
