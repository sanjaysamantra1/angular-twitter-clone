import { Component, OnInit } from '@angular/core';
import { Profile } from 'src/app/interfaces/profile';
import { Tweet } from 'src/app/interfaces/tweet';
import { UserService } from 'src/app/services/user.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-newtweet',
  templateUrl: './newtweet.component.html',
  styleUrls: ['./newtweet.component.scss']
})
export class NewtweetComponent implements OnInit {

  constructor(private userService: UserService, private http: HttpClient) { }

  ngOnInit(): void {
  }

  users: Profile[] = this.userService.getUsers();  
  mediaBtn=false;
  isClicked=false;
  OnClick(){
    this.isClicked=true;
  }
  newtweet: Tweet;
  tweettext = '';
  urls: any[] = [];
  format: any[] = [];
  filetype = "image/*, video/*";

	msg = "";

  onSelectFile(event: any) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      if(file.type.indexOf('image')> -1){
        this.format.push('image');
        this.filetype = "image/*";
      } else if(file.type.indexOf('video')> -1){
        this.format.push('video');
        this.mediaBtn = true;
        this.filetype = "video/*";
      }
      if(this.format.length == 2) {
        this.mediaBtn = true;
      }
      reader.onload = (event) => {
        this.urls.push((<FileReader>event.target).result);
        if(this.urls.length != 0 || this.tweettext.length != 0) this.click = false;
        else this.click = true; 
      }
    }
  }

  selectFiletype() {
    if(this.urls.length == 0) {
      this.filetype = "image/*, video/*";
    }
  }

  removeMedia(index: number) {
    this.format.splice(index,1);
    this.urls.splice(index,1);
    this.mediaBtn = false;
    if(this.urls.length != 0 || this.tweettext.length != 0) this.click = false;
    else this.click = true; 
  }
  
  addTweet() {
    this.newtweet = {} as Tweet;
    let date: Date = new Date();
    this.newtweet.tweetid = this.users[0].tweet.length + 1;
    this.newtweet.tweetcontent = this.tweettext;
    this.newtweet.time = "Just now";
    this.newtweet.retweet = 0;
    this.newtweet.reply = 0;
    this.newtweet.media = this.urls;
    this.newtweet.likes = 0;
    this.newtweet.date = date.toString();
    this.newtweet.format = this.format;
    console.log(this.newtweet.media[0]);
    this.userService.addNewTweet(this.newtweet);
    console.log(this.newtweet);
    this.tweettext = '';
    this.urls = [];
    this.format = [];
    this.mediaBtn = false;
    this.click = true;
  }

  click : boolean = true;
  onKey(event: KeyboardEvent) { 
    this.click = (event.target as HTMLInputElement).value === '' ? true:false;
  }

}