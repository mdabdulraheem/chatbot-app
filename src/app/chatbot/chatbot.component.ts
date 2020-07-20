import { Component, OnInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { HttpClient } from '@angular/common/http'
@Component({
  selector: "app-chatbot",
  templateUrl: "./chatbot.component.html",
  styleUrls: ["./chatbot.component.scss"],
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  messages = [];
  loading = false;
  url = 'https://us-central1-covid-info-chatbot-rmgmxb.cloudfunctions.net/dialogflowGateway';

  // Random ID
  sessionId = Math.random().toString(36).slice(-5);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.addBotMessage('Human Presence Detected. How can I help you?')
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    try {

      console.log("sHeight", this.myScrollContainer.nativeElement.scrollHeight);  
      console.log("yyyyyyy");
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  handleUserMessage(event) {
    const text = event.message;
    this.addUserMessage(text);
    this.loading = true;

    // reques
    this.http.post<any>(this.url, {sessionId: this.sessionId, text}).subscribe( res => {
      this.addBotMessage(res.fulfillmentText);
      this.loading = false;
    })
  }

  addUserMessage(text) {
    this.messages.push({
      text,
      sender: "You",
      reply: true,
      date: new Date(),
      scrollBottom: true,
    });
  }

  addBotMessage(text) {
    this.messages.push({
      text,
      sender: 'Bot',
      avatar: '/assets/bot.jpg',
      date: new Date(),
      scrollBottom: true
    });
  }

}
