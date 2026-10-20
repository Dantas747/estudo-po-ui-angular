import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { PoMenuItem, PoMenuModule, PoPageModule, PoToolbarModule, PoButtonModule, PoFieldModule } from '@po-ui/ng-components';

interface Usuario {
  nome: string;
  email: string;
  telefone: string;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, PoToolbarModule, PoMenuModule, PoPageModule, PoButtonModule, PoFieldModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  readonly menus: Array<PoMenuItem> = [{ label: 'Home' }];
  usuario: Usuario = { nome: '', email: '', telefone: '' };
  usuarioSalvo: Usuario | null = null;
  mensagem = '';

  salvar(formulario: NgForm): void {
    formulario.form.markAllAsTouched();
    this.mensagem = '';

    if (formulario.invalid || !this.usuario.nome.trim()) {
      this.mensagem = 'Confira os campos obrigatórios antes de salvar.';
      return;
    }

    this.usuarioSalvo = {
      nome: this.usuario.nome.trim(),
      email: this.usuario.email.trim(),
      telefone: this.usuario.telefone,
    };
    this.mensagem = 'Usuário salvo em memória com sucesso.';
    formulario.resetForm({ nome: '', email: '', telefone: '' });
  }
}
