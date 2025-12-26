import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
		error: null,
	};

	public static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("Uncaught error:", error, errorInfo);
	}

	private handleReload = () => {
		window.location.reload();
	};

	public render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						minHeight: "100vh",
						padding: "20px",
						fontFamily: "Inter, system-ui, sans-serif",
						textAlign: "center",
					}}
				>
					<h1
						style={{ fontSize: "24px", marginBottom: "16px", color: "#1f2937" }}
					>
						An error occurred
					</h1>
					<p
						style={{ fontSize: "16px", marginBottom: "24px", color: "#6b7280" }}
					>
						Sorry for the inconvenience. Please try reloading the page.
					</p>
					<button
						onClick={this.handleReload}
						style={{
							padding: "12px 24px",
							fontSize: "16px",
							backgroundColor: "#3b82f6",
							color: "white",
							border: "none",
							borderRadius: "8px",
							cursor: "pointer",
							transition: "background-color 0.2s",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.backgroundColor = "#2563eb";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.backgroundColor = "#3b82f6";
						}}
					>
						Reload the page
					</button>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;

