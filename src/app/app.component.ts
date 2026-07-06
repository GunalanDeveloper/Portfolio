import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeroComponent } from './components/hero/hero.component';
import { AboutComponent } from './components/about/about.component';
import { SkillsComponent } from './components/skills/skills.component';
import { ExperienceComponent } from './components/experience/experience.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeroComponent, AboutComponent, SkillsComponent, ExperienceComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'portfolio-app';
  currentSection = 'home';
  isClickScrolling = false;
  scrollTimeout: any = null;

  ngOnInit() {
    this.updateActiveMenu();
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.updateActiveMenu();
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.updateIndicator();
  }

  updateActiveMenu() {
    if (this.isClickScrolling) return;

    const sections = document.querySelectorAll('section[id], footer[id]');
    let current = '';

    sections.forEach(section => {
      const htmlElement = section as HTMLElement;
      const sectionTop = htmlElement.offsetTop;
      if (window.scrollY >= sectionTop - 150) {
        current = htmlElement.getAttribute('id') || '';
      }
    });

    this.currentSection = current;
    this.updateIndicator();
  }

  updateIndicator() {
    setTimeout(() => {
      const indicator = document.querySelector('.nav-indicator') as HTMLElement;
      const activeLink = document.querySelector('.navbar-nav .nav-link.active') as HTMLElement;
      if (indicator && activeLink) {
        indicator.style.width = `${activeLink.offsetWidth}px`;
        indicator.style.left = `${activeLink.offsetLeft}px`;
      }
    });
  }

  scrollToSection(sectionId: string) {
    this.isClickScrolling = true;
    this.currentSection = sectionId;
    this.updateIndicator();

    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    this.scrollTimeout = setTimeout(() => {
      this.isClickScrolling = false;
    }, 800);
  }

  downloadCV(event: Event) {
    event.preventDefault();
    fetch('docs/Resume.pdf')
      .then(response => {
        if (!response.ok) throw new Error('Network error');
        return response.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'Gunalan_Resume.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => {
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = 'docs/Resume.pdf';
        a.download = 'Gunalan_Resume.pdf';
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
  }
}
