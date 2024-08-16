import { Component, OnInit } from "@angular/core";
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PostService } from "../posts.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../model";
import { mimetype } from "./mime-type.validator";

@Component({
  selector: 'app-post-create',
  standalone: true,
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  private mode = 'create';
  private postId?: string;
  public post?: Post;
  loading = false;
  form: FormGroup;
  UploadedImage: string;

  constructor(public postsService: PostService, public route: ActivatedRoute){}

  ngOnInit(): void {
    this.form = new FormGroup({  
      title: new FormControl(null, {validators:[Validators.required, Validators.minLength(3)]}),
      content: new FormControl(null, {validators:[Validators.required]}),
      // image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimetype]}),
      image: new FormControl(null, {validators: [Validators.required]}),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')){
        this.mode = 'edit';
        this.postId = paramMap.get('postId') || '';
        this.loading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.loading = false;
          this.post = {id: postData._id, title: postData.title, content: postData.content, imagePath: ''};
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
          })
        });
      }
      else {
        this.mode = 'create';
        this.postId = '';
      }
    });
  }

  onAddPost = () => {
    if (this.form.invalid) return;
  
    this.loading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    } else {
      this.postsService.updatePost((this.postId || ''), this.form.value.title, this.form.value.content);
    }

    this.form.reset();
  }

  PickedImage(event: Event) {
    const file = (event.target as HTMLInputElement).files?.item(0);
    this.form.patchValue({image: file});
    this.form.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => this.UploadedImage = reader.result as string;
    reader.readAsDataURL(file as Blob);
  }
}