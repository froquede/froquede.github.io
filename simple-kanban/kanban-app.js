import { LitElement, html, css } from 'https://unpkg.com/lit@2.0.0/index.js?module';

class KanbanApp extends LitElement {
  static properties = {
    todo: { type: Array },
    doing: { type: Array },
    done: { type: Array }
  };

  static styles = css`
    .board {
      display: flex;
      justify-content: space-around;
      padding: 20px;
    }
    .column {
      background: #f0f0f0;
      padding: 20px;
      width: 30%;
      min-height: 300px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .card {
      background: white;
      margin-bottom: 10px;
      padding: 10px;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      cursor: grab;
    }
    .card-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
    }
  `;

  constructor() {
    super();
    this.todo = [];
    this.doing = [];
    this.done = [];
    this.loadBoard();
  }

  render() {
    return html`
      <div class="board">
        ${this.renderColumn('Todo', this.todo)}
        ${this.renderColumn('Doing', this.doing)}
        ${this.renderColumn('Done', this.done)}
      </div>
    `;
  }

  renderColumn(title, cards) {
    return html`
      <div class="column" @dragover=${this.allowDrop} @drop=${(e) => this.drop(e, title.toLowerCase())}>
        <h2>${title}</h2>
        ${cards.map((card, index) => this.renderCard(card, title.toLowerCase(), index))}
        <button @click=${() => this.addCard(title.toLowerCase())}>Add Card</button>
      </div>
    `;
  }

  renderCard(card, column, index) {
    return html`
      <div class="card" draggable="true" @dragstart=${(e) => this.drag(e, column, index)} @dblclick=${() => this.editCard(column, index)}>
        ${card.text}
        <div class="card-actions">
          <button @click=${() => this.deleteCard(column, index)}>Delete</button>
        </div>
      </div>
    `;
  }

  drag(event, column, index) {
    event.dataTransfer.setData('text/plain', JSON.stringify({ column, index }));
  }

  allowDrop(event) {
    event.preventDefault();
  }

  drop(event, column) {
    event.preventDefault();
    const data = JSON.parse(event.dataTransfer.getData('text/plain'));
    this.moveCard(data.column, data.index, column);
  }

  moveCard(fromColumn, fromIndex, toColumn) {
    if (fromColumn === toColumn) return;
    const card = this[fromColumn].splice(fromIndex, 1)[0];
    this[toColumn].push(card);
    this.requestUpdate();
    this.saveBoard();
  }

  addCard(column) {
    const newText = prompt('Enter new card text:');
    if (newText) {
      this[column].push({ text: newText });
      this.requestUpdate();
      this.saveBoard();
    }
  }

  deleteCard(column, index) {
    if (confirm('Are you sure you want to delete this card?')) {
      this[column].splice(index, 1);
      this.requestUpdate();
      this.saveBoard();
    }
  }

  editCard(column, index) {
    const newText = prompt('Edit card text:', this[column][index].text);
    if (newText !== null) {
      this[column][index].text = newText;
      this.requestUpdate();
      this.saveBoard();
    }
  }

  saveBoard() {
    localStorage.setItem('kanban-board', JSON.stringify({
      todo: this.todo,
      doing: this.doing,
      done: this.done
    }));
  }

  loadBoard() {
    const savedBoard = JSON.parse(localStorage.getItem('kanban-board'));
    if (savedBoard) {
      this.todo = savedBoard.todo || [];
      this.doing = savedBoard.doing || [];
      this.done = savedBoard.done || [];
    }
  }
}

customElements.define('kanban-app', KanbanApp);
