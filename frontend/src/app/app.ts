import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {  PoMenuItem      ,
          PoMenuModule    ,
          PoPageModule    ,
          PoToolbarModule ,
          PoButtonModule  ,
          PoFieldModule   ,
          PoTableColumn   ,
          PoTableModule
        } from '@po-ui/ng-components';

/** Interface Usuario — define os dados de um usuário e seu estado de seleção. */
interface Usuario {
  nome: string;
  email: string;
  telefone: string;
  $selected?: boolean;
}

/** Classe App — gerencia o cadastro, a pesquisa e a seleção de usuários. */
@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, PoToolbarModule, PoMenuModule, PoPageModule, PoButtonModule, PoFieldModule, PoTableModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  readonly colunasUsuarios: Array<PoTableColumn> = [
    { property: 'nome', label: 'Nome completo' },
    { property: 'email', label: 'Endereço eletrônico' },
    { property: 'telefone', label: 'Celular / WhatsApp' }
  ];
  readonly menus: Array<PoMenuItem> = [{ label: 'Home' }];
  usuario: Usuario = { nome: '', email: '', telefone: '' };
  usuarios: Usuario[] = [];
  mensagem = '';
  // Filtro para pesquisa de usuários
  filtroNome: string = '';

  // Usuário atualmente em edição, se houver.
  usuarioEmEdicao: Usuario | null = null;

  /** Método salvar — valida os dados, inclui ou altera o usuário e limpa o formulário. */
  salvar(formulario: NgForm): void {
    formulario.form.markAllAsTouched();
    this.mensagem = '';

    if (formulario.invalid || !this.usuario.nome.trim()) {
      this.mensagem = 'Confira os campos obrigatórios antes de salvar.';
      return;
    }

    const dados: Usuario = {
      nome: this.usuario.nome.trim(),
      email: this.usuario.email.trim(),
      telefone: this.usuario.telefone
    };

    if (this.usuarioEmEdicao !== null) {
      // Alteração — atualiza o usuário carregado para edição.
      const indice = this.usuarios.indexOf(this.usuarioEmEdicao);

      if (indice === -1) {
        this.mensagem = 'Usuário em edição não encontrado.';
        return;
      }

      this.usuarios[indice] = dados;
      this.usuarios = [...this.usuarios];
      this.mensagem = 'Usuário alterado com sucesso.';
    } else {
      // Inclusão — adiciona um novo usuário à lista.
      this.usuarios.push(dados);
      this.mensagem = 'Usuário incluído com sucesso.';
    }

    // Encerra a operação e prepara o formulário para uma nova inclusão.
    this.usuarioEmEdicao = null;
    formulario.resetForm({
      nome: '',
      email: '',
      telefone: ''
    });
  }

  /** Método verificarSelecionados — informa a quantidade de usuários selecionados na tabela. */
  verificarSelecionados(): void {
    const selecionados = this.usuarios.filter(
      usuario => usuario.$selected === true
    );

    this.mensagem = `${selecionados.length} usuário(s) selecionado(s).`;
  }

  /** Getter usuariosFiltrados — retorna os usuários que correspondem ao filtro de nome. */
  get usuariosFiltrados(): Usuario[] {
    const filtro = this.filtroNome.trim().toLocaleLowerCase('pt-BR');

    if (!filtro) {
      return this.usuarios;
    }
    // Filtra os usuários pelo nome informado no campo de pesquisa
    return this.usuarios.filter(usuario =>
      usuario.nome.toLocaleLowerCase('pt-BR').includes(filtro)
    );

  }

    /** Método excluirSelecionados — remove os usuários selecionados da tabela. */
    excluirSelecionados(): void {
    const selecionados = this.usuarios.filter(
      usuario => usuario.$selected === true
    );

    if (selecionados.length === 0) {
      this.mensagem = 'Selecione pelo menos um usuário para excluir.';
      return;
    }

    const confirma = window.confirm(
      `Deseja realmente excluir ${selecionados.length} usuário(s)?`
    );

    if (!confirma) {
      return;
    }

    this.usuarios = this.usuarios.filter(
      usuario => usuario.$selected !== true
    );

    this.mensagem = `${selecionados.length} usuário(s) excluído(s) com sucesso.`;
}

  /** Método alterarSelecionado — permite alterar os dados de um usuário selecionado. */
  alterarSelecionado(): void {
    const selecionados = this.usuarios.filter(
      usuario => usuario.$selected === true
    );

    if (selecionados.length !== 1) {
      this.mensagem = 'Selecione apenas um usuário para alterar.';
      return;
    }

    this.usuarioEmEdicao = selecionados[0];

    // Copia os dados para o formulário
    this.usuario = {
      nome: this.usuarioEmEdicao.nome,
      email: this.usuarioEmEdicao.email,
      telefone: this.usuarioEmEdicao.telefone
    };

    this.mensagem = 'Altere os dados e clique em Salvar.';
  }

}




