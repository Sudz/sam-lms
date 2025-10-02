import { g as getEnvVar, e as env } from './better-auth.CiuwFiHM.mjs';

const COLORS_2 = 1;
const COLORS_16 = 4;
const COLORS_256 = 8;
const COLORS_16m = 24;
const TERM_ENVS = {
  eterm: COLORS_16,
  cons25: COLORS_16,
  console: COLORS_16,
  cygwin: COLORS_16,
  dtterm: COLORS_16,
  gnome: COLORS_16,
  hurd: COLORS_16,
  jfbterm: COLORS_16,
  konsole: COLORS_16,
  kterm: COLORS_16,
  mlterm: COLORS_16,
  mosh: COLORS_16m,
  putty: COLORS_16,
  st: COLORS_16,
  // http://lists.schmorp.de/pipermail/rxvt-unicode/2016q2/002261.html
  "rxvt-unicode-24bit": COLORS_16m,
  // https://bugs.launchpad.net/terminator/+bug/1030562
  terminator: COLORS_16m,
  "xterm-kitty": COLORS_16m
};
const CI_ENVS_MAP = new Map(
  Object.entries({
    APPVEYOR: COLORS_256,
    BUILDKITE: COLORS_256,
    CIRCLECI: COLORS_16m,
    DRONE: COLORS_256,
    GITEA_ACTIONS: COLORS_16m,
    GITHUB_ACTIONS: COLORS_16m,
    GITLAB_CI: COLORS_256,
    TRAVIS: COLORS_256
  })
);
const TERM_ENVS_REG_EXP = [
  /ansi/,
  /color/,
  /linux/,
  /direct/,
  /^con[0-9]*x[0-9]/,
  /^rxvt/,
  /^screen/,
  /^xterm/,
  /^vt100/,
  /^vt220/
];
function getColorDepth() {
  if (getEnvVar("FORCE_COLOR") !== void 0) {
    switch (getEnvVar("FORCE_COLOR")) {
      case "":
      case "1":
      case "true":
        return COLORS_16;
      case "2":
        return COLORS_256;
      case "3":
        return COLORS_16m;
      default:
        return COLORS_2;
    }
  }
  if (getEnvVar("NODE_DISABLE_COLORS") !== void 0 && getEnvVar("NODE_DISABLE_COLORS") !== "" || // See https://no-color.org/
  getEnvVar("NO_COLOR") !== void 0 && getEnvVar("NO_COLOR") !== "" || // The "dumb" special terminal, as defined by terminfo, doesn't support
  // ANSI color control codes.
  // See https://invisible-island.net/ncurses/terminfo.ti.html#toc-_Specials
  getEnvVar("TERM") === "dumb") {
    return COLORS_2;
  }
  if (typeof process !== "undefined" && process.platform === "win32") {
    return COLORS_16m;
  }
  if (getEnvVar("TMUX")) {
    return COLORS_16m;
  }
  if ("TF_BUILD" in env && "AGENT_NAME" in env) {
    return COLORS_16;
  }
  if ("CI" in env) {
    for (const { 0: envName, 1: colors } of CI_ENVS_MAP) {
      if (envName in env) {
        return colors;
      }
    }
    if (getEnvVar("CI_NAME") === "codeship") {
      return COLORS_256;
    }
    return COLORS_2;
  }
  if ("TEAMCITY_VERSION" in env) {
    return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.exec(
      getEnvVar("TEAMCITY_VERSION")
    ) !== null ? COLORS_16 : COLORS_2;
  }
  switch (getEnvVar("TERM_PROGRAM")) {
    case "iTerm.app":
      if (!getEnvVar("TERM_PROGRAM_VERSION") || /^[0-2]\./.exec(getEnvVar("TERM_PROGRAM_VERSION")) !== null) {
        return COLORS_256;
      }
      return COLORS_16m;
    case "HyperTerm":
    case "MacTerm":
      return COLORS_16m;
    case "Apple_Terminal":
      return COLORS_256;
  }
  if (getEnvVar("COLORTERM") === "truecolor" || getEnvVar("COLORTERM") === "24bit") {
    return COLORS_16m;
  }
  if (getEnvVar("TERM")) {
    if (/truecolor/.exec(getEnvVar("TERM")) !== null) {
      return COLORS_16m;
    }
    if (/^xterm-256/.exec(getEnvVar("TERM")) !== null) {
      return COLORS_256;
    }
    const termEnv = getEnvVar("TERM").toLowerCase();
    if (TERM_ENVS[termEnv]) {
      return TERM_ENVS[termEnv];
    }
    if (TERM_ENVS_REG_EXP.some((term) => term.exec(termEnv) !== null)) {
      return COLORS_16;
    }
  }
  if (getEnvVar("COLORTERM")) {
    return COLORS_16;
  }
  return COLORS_2;
}

const colors = {
  reset: "\x1B[0m",
  bright: "\x1B[1m",
  dim: "\x1B[2m",
  fg: {
    red: "\x1B[31m",
    green: "\x1B[32m",
    yellow: "\x1B[33m",
    blue: "\x1B[34m",
    magenta: "\x1B[35m"},
  bg: {
    black: "\x1B[40m"}
};

const levels = ["info", "success", "warn", "error", "debug"];
function shouldPublishLog(currentLogLevel, logLevel) {
  return levels.indexOf(logLevel) <= levels.indexOf(currentLogLevel);
}
const levelColors = {
  info: colors.fg.blue,
  success: colors.fg.green,
  warn: colors.fg.yellow,
  error: colors.fg.red,
  debug: colors.fg.magenta
};
const formatMessage = (level, message, colorsEnabled) => {
  const timestamp = (/* @__PURE__ */ new Date()).toISOString();
  if (colorsEnabled) {
    return `${colors.dim}${timestamp}${colors.reset} ${levelColors[level]}${level.toUpperCase()}${colors.reset} ${colors.bright}[Better Auth]:${colors.reset} ${message}`;
  }
  return `${timestamp} ${level.toUpperCase()} [Better Auth]: ${message}`;
};
const createLogger = (options) => {
  const enabled = options?.disabled !== true;
  const logLevel = options?.level ?? "error";
  const isDisableColorsSpecified = options?.disableColors !== void 0;
  const colorsEnabled = isDisableColorsSpecified ? !options.disableColors : getColorDepth() !== 1;
  const LogFunc = (level, message, args = []) => {
    if (!enabled || !shouldPublishLog(logLevel, level)) {
      return;
    }
    const formattedMessage = formatMessage(level, message, colorsEnabled);
    if (!options || typeof options.log !== "function") {
      if (level === "error") {
        console.error(formattedMessage, ...args);
      } else if (level === "warn") {
        console.warn(formattedMessage, ...args);
      } else {
        console.log(formattedMessage, ...args);
      }
      return;
    }
    options.log(level === "success" ? "info" : level, message, ...args);
  };
  const logger2 = Object.fromEntries(
    levels.map((level) => [
      level,
      (...[message, ...args]) => LogFunc(level, message, args)
    ])
  );
  return {
    ...logger2,
    get level() {
      return logLevel;
    }
  };
};
const logger = createLogger();

export { logger as a, colors as b, createLogger as c, levels as l, shouldPublishLog as s };
