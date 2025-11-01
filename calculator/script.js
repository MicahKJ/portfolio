(function() {
  const exprEl = document.getElementById('expression');
  const resultEl = document.getElementById('result');
  const keys = document.querySelectorAll('[data-value], [data-action]');
  let expression = '';

  function render() {
    exprEl.textContent = expression;
    resultEl.textContent = expression === '' ? '0' : expression;
  }

  function append(token) {
    expression += token;
    render();
  }

  function backspace() {
    expression = expression.slice(0, -1);
    render();
  }

  function clearAll() {
    expression = '';
    render();
  }

  function sanitizeForEval(src) {
    const mapped = src.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
    if (!/^[0-9+\-*/().\s]*$/.test(mapped)) {
      throw new Error('Invalid characters');
    }
    return mapped;
  }

  function evaluateExpression() {
    if (expression.trim() === '') return;
    try {
      const safe = sanitizeForEval(expression);
      const value = Function('return (' + safe + ')')();
      if (value === Infinity || value === -Infinity || Number.isNaN(value))
        throw new Error('Math error');
      expression = String(value);
      render();
    } catch (err) {
      resultEl.textContent = 'Error';
      setTimeout(() => {
        resultEl.textContent = expression === '' ? '0' : expression;
      }, 900);
    }
  }

  keys.forEach(k =>
    k.addEventListener('click', () => {
      const v = k.getAttribute('data-value');
      const a = k.getAttribute('data-action');
      if (a === 'clear') return clearAll();
      if (a === 'back') return backspace();
      if (a === 'equals') return evaluateExpression();
      if (v) append(v);
    })
  );

  window.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); return evaluateExpression(); }
    if (e.key === 'Backspace') { e.preventDefault(); return backspace(); }
    if (e.key === 'Escape') { e.preventDefault(); return clearAll(); }

    const key = e.key;
    if (/^[0-9]$/.test(key) || ['+', '-', '*', '/', '.', '(', ')'].includes(key)) {
      append(key);
    }
  });

  render();
})();
