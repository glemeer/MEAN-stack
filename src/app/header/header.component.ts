import { Component } from "@angular/core";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterLink } from "@angular/router";
import { MatButton } from "@angular/material/button";

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  imports: [MatToolbarModule, RouterLink, MatButton],
  styleUrl: './header.component.css',
})
export class HeaderComponent {

}