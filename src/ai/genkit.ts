export const ai: any = {
  // definePrompt debe devolver una función que, al llamarla, devuelva un objeto con `output`
  definePrompt: (_opts: any) => {
    return async (_input: any) => {
      // Respuesta por defecto para cuando la funcionalidad AI real no esté disponible
      return { output: { figureSuggestion: 'Funcionalidad AI deshabilitada temporalmente.' } };
    };
  },

  // defineFlow debe recibir la función de flujo y devolverla para que pueda ejecutarse
  defineFlow: (_opts: any, fn: (input: any) => Promise<any>) => {
    return async (input: any) => {
      return fn(input);
    };
  },
};