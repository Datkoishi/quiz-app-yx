"use client"

import { useEffect } from "react"

interface MathFormulaProps {
  formula: string
  display?: boolean
}

export function MathFormula({ formula, display = false }: MathFormulaProps) {
  useEffect(() => {
    // Dynamically import KaTeX
    const loadKatex = async () => {
      const katex = await import("katex")
      await import("katex/dist/katex.min.css")

      // Find all elements with class 'math-formula'
      const elements = document.querySelectorAll(".math-formula")

      elements.forEach((element) => {
        const formula = element.getAttribute("data-formula")
        const displayMode = element.getAttribute("data-display") === "true"

        if (formula) {
          katex.default.render(formula, element as HTMLElement, {
            throwOnError: false,
            displayMode,
          })
        }
      })
    }

    loadKatex()
  }, [formula])

  return <span className="math-formula" data-formula={formula} data-display={display.toString()} />
}
