import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CadastroService } from '../services/cadastro.service';

@Component({
  selector: 'app-quinta',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './componente.html',
  styleUrls: ['./componente.css']
})
export class QuintaComponent implements OnInit, AfterViewInit {
  constructor(
    private cadastroService: CadastroService,
    private cdr: ChangeDetectorRef
  ) {}

  nome: string = '';
  email: string = '';
  celular: string = '';
  telefone: string = '';
  cpf: string = '';
  dataNascimento: string = '';
  contatos: any[] = [];
  contatoEditando: any = null;

  @ViewChild('emailInput', { static: false }) emailInput?: ElementRef<HTMLInputElement>;
  @ViewChild('telefoneInput', { static: false }) telefoneInput?: ElementRef<HTMLInputElement>;
  @ViewChild('celularInput', { static: false }) celularInput?: ElementRef<HTMLInputElement>;
  @ViewChild('cpfInput', { static: false }) cpfInput?: ElementRef<HTMLInputElement>;
  @ViewChild('dobInput', { static: false }) dobInput?: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    this.email = '';
    this.celular = '';
    this.telefone = '';
    this.cpf = '';
    this.dataNascimento = '';
    this.carregarContatos();
  }

  ngAfterViewInit(): void {
    try {
      if (this.emailInput && this.emailInput.nativeElement) {
        const el = this.emailInput.nativeElement;
        el.value = '';
        el.setAttribute('autocomplete', 'off');
        el.setAttribute('name', 'noemail');
      }
      if (this.telefoneInput && this.telefoneInput.nativeElement) {
        const el = this.telefoneInput.nativeElement;
        el.value = '';
        el.setAttribute('autocomplete', 'off');
      }
      if (this.celularInput && this.celularInput.nativeElement) {
        const el = this.celularInput.nativeElement;
        el.value = '';
        el.setAttribute('autocomplete', 'off');
      }
      if (this.cpfInput && this.cpfInput.nativeElement) {
        const el = this.cpfInput.nativeElement;
        el.value = '';
        el.setAttribute('autocomplete', 'off');
      }
      if (this.dobInput && this.dobInput.nativeElement) {
        const el = this.dobInput.nativeElement;
        el.value = '';
        el.setAttribute('autocomplete', 'off');
      }
    } catch (e) {}
  }

  limparNome(): void {
    this.nome = '';
    this.email = '';
    this.celular = '';
    this.telefone = '';
    this.cpf = '';
    this.dataNascimento = '';
    this.contatoEditando = null;
  }

  private formatCPF(digits: string): string {
    if (!digits) return '';
    const d = digits.replace(/\D/g, '').slice(0, 11);
    const p1 = d.substring(0, 3);
    const p2 = d.substring(3, 6);
    const p3 = d.substring(6, 9);
    const p4 = d.substring(9, 11);

    if (d.length <= 3) return p1;
    if (d.length <= 6) return `${p1}.${p2}`;
    if (d.length <= 9) return `${p1}.${p2}.${p3}`;
    return `${p1}.${p2}.${p3}-${p4}`;
  }

  onCpfInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input) return;
    const digits = (input.value || '').toString().replace(/\D/g, '').slice(0, 11);
    const formatted = this.formatCPF(digits);
    this.cpf = formatted;
    try {
      if (this.cpfInput && this.cpfInput.nativeElement) {
        this.cpfInput.nativeElement.value = formatted;
      } else {
        input.value = formatted;
      }
    } catch (e) {
      input.value = formatted;
    }
  }

  private formatDateFromDigits(digits: string): string {
    if (!digits) return '';
    const d = digits.replace(/\D/g, '').slice(0, 8);
    const dd = d.substring(0, 2);
    const mm = d.substring(2, 4);
    const yyyy = d.substring(4, 8);

    if (d.length <= 2) return dd;
    if (d.length <= 4) return `${dd}/${mm}`;
    return `${dd}/${mm}/${yyyy}`;
  }

  onDateInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input) return;
    const digits = (input.value || '').toString().replace(/\D/g, '').slice(0, 8);
    const formatted = this.formatDateFromDigits(digits);
    this.dataNascimento = formatted;
    try {
      if (this.dobInput && this.dobInput.nativeElement) {
        this.dobInput.nativeElement.value = formatted;
      } else {
        input.value = formatted;
      }
    } catch (e) {
      input.value = formatted;
    }
  }

  cadastrar(): void {
    const valor = this.nome?.toString().trim() ?? '';
    const emailVal = this.email?.toString().trim() ?? '';

    if (!valor) {
      alert('Preencha o campo Nome!');
      return;
    }

    if (!emailVal) {
      alert('Preencha o campo E-mail!');
      return;
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i;
    if (!emailRegex.test(emailVal)) {
      alert('E-mail inválido');
      return;
    }

    if (!emailVal.toLowerCase().endsWith('@gmail.com')) {
      alert('O e-mail deve ser um endereço @gmail.com');
      return;
    }

    const payload: Record<string, any> = {
      nome: valor,
      email: emailVal
    };

    const celularDisplay = (this.celular || '').toString().trim();
    const telefoneDisplay = (this.telefone || '').toString().trim();
    const cpfDisplay = (this.cpf || '').toString().trim();
    const dataNascimentoDisplay = (this.dataNascimento || '').toString().trim();

    if (celularDisplay) payload['celular'] = celularDisplay;
    if (telefoneDisplay) payload['telefone'] = telefoneDisplay;
    if (cpfDisplay) payload['cpf'] = cpfDisplay;
    if (dataNascimentoDisplay) payload['dataNascimento'] = dataNascimentoDisplay;

    if (this.contatoEditando) {
      payload['id'] = this.contatoEditando.id;
    }

    console.log('Enviando dados para o backend:', payload);
    this.cadastroService.salvarCadastro(payload).subscribe({
      next: (response: any) => {
        console.log('Resposta do backend:', response);
        const acao = this.contatoEditando ? 'atualizado' : 'cadastrado';
        
        this.contatoEditando = null;
        this.limparNome();
        
        this.cadastroService.listarCadastros().subscribe({
          next: (dados) => {
            console.log('Contatos recarregados:', dados);
            this.contatos = dados;
            this.cdr.markForCheck();
            setTimeout(() => this.cdr.detectChanges(), 0);
            alert(`Contato ${acao} com sucesso!`);
          },
          error: (erro) => {
            console.error('Erro ao recarregar:', erro);
            alert(`Contato ${acao}, mas erro ao atualizar tabela. Recarregue a página.`);
          }
        });
      },
      error: (error: any) => {
        console.error('Erro completo ao salvar contato:', error);
        console.error('Status:', error.status);
        console.error('Mensagem:', error.message);
        console.error('Error object:', error.error);
        
        let mensagemErro = 'Erro desconhecido';
        
        if (error.status === 0) {
          mensagemErro = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.';
        } else if (error.error?.erro) {
          mensagemErro = error.error.erro;
        } else if (error.error?.detalhes) {
          mensagemErro = error.error.detalhes;
        } else if (error.message) {
          mensagemErro = error.message;
        }
        
        alert(`Erro: ${mensagemErro}`);
      }
    });
  }

  carregarContatos(): void {
    console.log('Carregando contatos do banco de dados...');
    this.cadastroService.listarCadastros().subscribe({
      next: (dados) => {
        console.log('Contatos recebidos:', dados);
        this.contatos = [...dados];
        this.cdr.detectChanges();
        console.log('Tabela atualizada com', this.contatos.length, 'contatos');
      },
      error: (erro) => {
        console.error('Erro ao carregar contatos:', erro);
      }
    });
  }

  editarContato(contato: any): void {
    this.contatoEditando = contato;
    this.nome = contato.nome || '';
    this.email = contato.email || '';
    this.celular = contato.celular || '';
    this.telefone = contato.telefone || '';
    this.cpf = contato.cpf || '';
    this.dataNascimento = contato.data_nascimento || '';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  excluirContato(contato: any): void {
    const confirmacao = confirm(`Tem certeza que deseja excluir o contato "${contato.nome}"?`);
    
    if (!confirmacao) {
      return;
    }

    console.log('Excluindo contato ID:', contato.id);
    this.cadastroService.excluirCadastro(contato.id).subscribe({
      next: (response: any) => {
        console.log('Contato excluído com sucesso');
        alert('Contato excluído com sucesso!');
        
        if (this.contatoEditando?.id === contato.id) {
          this.limparNome();
          this.contatoEditando = null;
        }
        
        this.carregarContatos();
      },
      error: (error: any) => {
        console.error('Erro ao excluir contato:', error);
        let mensagemErro = 'Erro desconhecido';
        
        if (error.status === 0) {
          mensagemErro = 'Não foi possível conectar ao servidor.';
        } else if (error.error?.erro) {
          mensagemErro = error.error.erro;
        } else if (error.message) {
          mensagemErro = error.message;
        }
        
        alert(`Erro ao excluir: ${mensagemErro}`);
      }
    });
  }
}