const client = {
  appName: fillDefault(process.env.appName, "OhMyGPT"),
  appLogo: process.env.appLogo ?? undefined,
  appThemeColor: fillDefault(process.env.appThemeColor, "#22c55e"),
  appSummary: fillDefault(process.env.appSummary, "Ask me any thing you want."),
  exampleInput: process.env.exampleInput ?? "Ask me any thing.",
  googleClientId: "1057023803685-1im8k2dv6rcofeunan4986fidsl62p0n.apps.googleusercontent.com"
};

export default client;

function fillDefault(value: string | undefined, defaultValue: string): string {
  return !value ? defaultValue : value;
}
