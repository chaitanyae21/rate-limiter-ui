/*
 * Simple Rate Limiter UI built with React. Users can configure the maximum
 * requests per second (RPS) allowed. A simulated usage bar updates once per
 * second to reflect current consumption relative to the configured limit.
 * Settings are persisted to localStorage so that reloads retain the last
 * configured limit. No backend is required; everything runs client side.
 */
(function () {
  const { useState, useEffect } = React;

  function RateLimiter() {
    // Read the saved limit from localStorage or default to 10
    const [limit, setLimit] = useState(() => {
      const saved = window.localStorage.getItem('rateLimit');
      return saved ? parseInt(saved, 10) : 10;
    });
    // Current usage simulated value
    const [usage, setUsage] = useState(0);

    // Persist the limit whenever it changes
    useEffect(() => {
      window.localStorage.setItem('rateLimit', String(limit));
    }, [limit]);

    // Simulate usage: every second update usage randomly between 0 and limit
    useEffect(() => {
      const interval = setInterval(() => {
        setUsage(Math.floor(Math.random() * (limit + 1)));
      }, 1000);
      return () => clearInterval(interval);
    }, [limit]);

    // Handle limit change from input
    const handleLimitChange = (e) => {
      let value = parseInt(e.target.value, 10);
      if (isNaN(value) || value <= 0) value = 1;
      setLimit(value);
    };

    // Compute the percent of usage relative to the limit
    const percent = Math.min(usage / (limit || 1), 1);

    return React.createElement(
      'div',
      { className: 'rate-limiter-container' },
      [
        React.createElement('h1', { key: 'title' }, 'Rate Limiter Config'),
        React.createElement(
          'div',
          { className: 'config', key: 'config' },
          [
            React.createElement(
              'label',
              { key: 'label', htmlFor: 'limit-input' },
              'Max requests per second:'
            ),
            React.createElement('input', {
              key: 'input',
              id: 'limit-input',
              type: 'number',
              min: 1,
              value: limit,
              onChange: handleLimitChange,
            }),
          ]
        ),
        React.createElement(
          'div',
          { className: 'bar-container', key: 'bar' },
          [
            React.createElement('div', {
              key: 'bar-fill',
              className: 'bar-fill',
              style: { width: `${percent * 100}%` },
            }),
          ]
        ),
        React.createElement(
          'p',
          { key: 'status', className: 'status-text' },
          `Usage: ${usage} / ${limit} req/s`
        ),
      ]
    );
  }

  function App() {
    return React.createElement(RateLimiter, null);
  }
  // Render into root
  ReactDOM.render(React.createElement(App), document.getElementById('root'));
})();