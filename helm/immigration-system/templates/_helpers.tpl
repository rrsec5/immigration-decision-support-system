{{/*
Expand the chart name.
*/}}
{{- define "immigration-system.name" -}}
{{- .Chart.Name -}}
{{- end -}}

{{/*
Create chart name and version.
*/}}
{{- define "immigration-system.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" -}}
{{- end -}}


{{/*
Common labels
*/}}
{{- define "immigration-system.labels" -}}

helm.sh/chart: {{ include "immigration-system.chart" . }}

app.kubernetes.io/name: {{ include "immigration-system.name" . }}

app.kubernetes.io/instance: {{ .Release.Name }}

app.kubernetes.io/managed-by: {{ .Release.Service }}

{{- end -}}


{{/*
Component label.
*/}}
{{- define "immigration-system.component" -}}
app.kubernetes.io/component: {{ .component }}
{{- end -}}


{{/*
Selector labels.
*/}}
{{- define "immigration-system.selectorLabels" -}}

app.kubernetes.io/name: {{ include "immigration-system.name" .root }}

app.kubernetes.io/component: {{ .component }}

{{- end -}}


{{/*
Readiness + Liveness probes
Usage:
{{ include "immigration-system.probes" . | nindent 10 }}
*/}}
{{- define "immigration-system.probes" -}}

readinessProbe:
  httpGet:
    path: {{ .probes.readiness.path }}
    port: {{ .container.port }}
  initialDelaySeconds: {{ .probes.readiness.initialDelaySeconds }}
  periodSeconds: {{ .probes.readiness.periodSeconds }}

livenessProbe:
  httpGet:
    path: {{ .probes.liveness.path }}
    port: {{ .container.port }}
  initialDelaySeconds: {{ .probes.liveness.initialDelaySeconds }}
  periodSeconds: {{ .probes.liveness.periodSeconds }}

{{- end }}