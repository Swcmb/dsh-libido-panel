window.__ModuleLoader__.load({
  id: 'dsh-libido-panel',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const ENDPOINT = 'http://127.0.0.1:41888/api/state';
    const POLL_MS = 30000;

    const wrap = {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      margin: '0 auto',
      width: 'fit-content',
      maxWidth: '100%',
      padding: '0 2px',
      font: 'inherit',
      fontSize: 12,
      lineHeight: '16px',
      color: 'inherit',
      opacity: 0.86,
      userSelect: 'none',
    };

    function bar(value) {
      return h('span', {
        key: 'bar',
        style: {
          position: 'relative',
          display: 'inline-block',
          width: 54,
          height: 3,
          borderRadius: 2,
          background: 'currentColor',
          opacity: 0.18,
          overflow: 'hidden',
        },
      }, h('span', {
        style: {
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: Math.max(0, Math.min(100, value)) + '%',
          borderRadius: 2,
          background: 'currentColor',
          opacity: 1,
        },
      }));
    }

    function LibidoHud() {
      const [state, setState] = React.useState(null);
      const [down, setDown] = React.useState(false);

      React.useEffect(() => {
        let live = true;
        let timer = 0;
        const pull = () => {
          fetch(ENDPOINT, { cache: 'no-store' })
            .then(function (res) {
              if (!res.ok) throw new Error('status ' + res.status);
              return res.json();
            })
            .then(function (data) {
              if (!live) return;
              setState(data);
              setDown(false);
            })
            .catch(function () {
              if (live) setDown(true);
            });
        };
        pull();
        timer = setInterval(pull, POLL_MS);
        return function () {
          live = false;
          clearInterval(timer);
        };
      }, []);

      if (down) {
        return h('div', { style: wrap, title: '状态面板未启动，请先运行 panel/start.bat' },
          h('span', null, '面板没开'));
      }
      if (!state) return null;

      const parts = [
        h('span', { key: 'l', style: { opacity: 0.5 } }, '性欲'),
        h('span', { key: 'n', style: { fontVariantNumeric: 'tabular-nums', fontWeight: 600 } }, String(state.current)),
        bar(state.current),
        h('span', { key: 't', style: { opacity: 0.72 } }, state.tier || ''),
      ];

      if (state.season && state.season.active) {
        parts.push(h('span', { key: 's', style: { opacity: 0.55 } },
          '发情期第 ' + Math.max(1, Math.floor(state.season.day)) + ' 天'));
      } else if (state.season && Number.isFinite(state.season.daysUntil)) {
        parts.push(h('span', { key: 's', style: { opacity: 0.55 } },
          Math.max(0, Math.ceil(state.season.daysUntil)) + ' 天后'));
      }
      if (state.activeNote) {
        parts.push(h('span', { key: 'a', style: { opacity: 0.55 } }, state.activeNote));
      }

      return h('div', {
        style: wrap,
        title: '性欲值 ' + state.current + ' / 100   ' + (state.tier || '') + '   （数据来自 127.0.0.1:41888）',
      }, parts);
    }

    return {
      inject: ['slots'],
      apply(ctx) {
        ctx.slots.inject('conversation.input.dock', () => ctx.slots.register({
          name: 'conversation.input.dock',
          id: 'libido-hud',
          order: 5,
        }, LibidoHud));
      },
    };
  },
});
