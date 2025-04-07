"use client"

import React from 'react'
import Error from '@/components/Error'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Error
          error={this.state.error}
          reset={() => this.setState({ hasError: false, error: null })}
        />
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary 