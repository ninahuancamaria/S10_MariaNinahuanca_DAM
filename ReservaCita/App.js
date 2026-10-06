import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';

export default function App() {
  // ── Estado de los campos del formulario ──────────────────────────────
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [fecha, setFecha] = useState('');
  const [motivo, setMotivo] = useState('');

  // ── Estado de errores por campo ──────────────────────────────────────
  const [errores, setErrores] = useState({});

  // ── Estado de resultado final ────────────────────────────────────────
  const [enviado, setEnviado] = useState(false);

  // ── Validaciones ─────────────────────────────────────────────────────
  const validar = () => {
    const nuevosErrores = {};

    // Validación 1: Nombre obligatorio
    if (!nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio.';
    }

    // Validación 2: Correo obligatorio y debe contener @
    if (!correo.trim()) {
      nuevosErrores.correo = 'El correo es obligatorio.';
    } else if (!correo.includes('@')) {
      nuevosErrores.correo = 'El correo debe contener "@".';
    }

    // Validación 3: Fecha requerida y formato DD/MM/AAAA
    if (!fecha.trim()) {
      nuevosErrores.fecha = 'La fecha es obligatoria.';
    } else {
      // Formato esperado: DD/MM/AAAA
      const regexFecha = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!regexFecha.test(fecha.trim())) {
        nuevosErrores.fecha = 'Formato inválido. Usa DD/MM/AAAA.';
      }
    }

    // Validación 4: Motivo obligatorio
    if (!motivo.trim()) {
      nuevosErrores.motivo = 'El motivo es obligatorio.';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // ── Envío del formulario ──────────────────────────────────────────────
  const handleEnviar = () => {
    if (validar()) {
      setEnviado(true);
    }
  };

  // ── Resetear formulario ───────────────────────────────────────────────
  const handleNuevaCita = () => {
    setNombre('');
    setCorreo('');
    setFecha('');
    setMotivo('');
    setErrores({});
    setEnviado(false);
  };

  // ── Pantalla de éxito ─────────────────────────────────────────────────
  if (enviado) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.successContainer}>
          <View style={styles.successIconCircle}>
            <Text style={styles.successIcon}>✓</Text>
          </View>
          <Text style={styles.successTitle}>¡Cita Reservada!</Text>
          <Text style={styles.successSubtitle}>
            Tu cita ha sido registrada correctamente.
          </Text>

          <View style={styles.successCard}>
            <ResumenFila label="Nombre" value={nombre} />
            <ResumenFila label="Correo" value={correo} />
            <ResumenFila label="Fecha" value={fecha} />
            <ResumenFila label="Motivo" value={motivo} />
          </View>

          <Pressable style={styles.btnNueva} onPress={handleNuevaCita}>
            <Text style={styles.btnNuevaText}>Nueva Reserva</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ── Formulario ────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Encabezado */}
          <View style={styles.header}>
            <Text style={styles.headerBadge}>📅 Formulario</Text>
            <Text style={styles.headerTitle}>Reserva de Cita</Text>
            <Text style={styles.headerSubtitle}>
              Completa los datos para agendar tu cita médica.
            </Text>
          </View>

          {/* Tarjeta del formulario */}
          <View style={styles.card}>

            {/* Campo: Nombre */}
            <Campo
              label="Nombre completo"
              placeholder="Ej. María Ninahuanca"
              value={nombre}
              onChangeText={(text) => {
                setNombre(text);
                if (errores.nombre) setErrores({ ...errores, nombre: null });
              }}
              error={errores.nombre}
              icon="👤"
            />

            {/* Campo: Correo */}
            <Campo
              label="Correo electrónico"
              placeholder="Ej. maria@correo.com"
              value={correo}
              onChangeText={(text) => {
                setCorreo(text);
                if (errores.correo) setErrores({ ...errores, correo: null });
              }}
              error={errores.correo}
              icon="✉️"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Campo: Fecha */}
            <Campo
              label="Fecha de la cita"
              placeholder="DD/MM/AAAA  (Ej. 15/10/2026)"
              value={fecha}
              onChangeText={(text) => {
                setFecha(text);
                if (errores.fecha) setErrores({ ...errores, fecha: null });
              }}
              error={errores.fecha}
              icon="📆"
              keyboardType="numbers-and-punctuation"
            />

            {/* Campo: Motivo */}
            <Campo
              label="Motivo de la cita"
              placeholder="Ej. Consulta general, revisión..."
              value={motivo}
              onChangeText={(text) => {
                setMotivo(text);
                if (errores.motivo) setErrores({ ...errores, motivo: null });
              }}
              error={errores.motivo}
              icon="📋"
              multiline
              numberOfLines={3}
            />

            {/* Botón de envío */}
            <Pressable
              style={({ pressed }) => [
                styles.btnEnviar,
                pressed && styles.btnEnviarPressed,
              ]}
              onPress={handleEnviar}
            >
              <Text style={styles.btnEnviarText}>Reservar Cita</Text>
            </Pressable>
          </View>

          {/* Nota informativa */}
          <Text style={styles.nota}>
            ℹ️  Todos los campos son obligatorios.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Componente reutilizable: Campo de entrada ─────────────────────────────
function Campo({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  icon,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  autoCapitalize = 'words',
}) {
  return (
    <View style={styles.campoWrapper}>
      <Text style={styles.campoLabel}>
        {icon}  {label}
      </Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.inputMultiline,
          error ? styles.inputError : styles.inputNormal,
        ]}
        placeholder={placeholder}
        placeholderTextColor="#adb5bd"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
      {error ? (
        <View style={styles.errorRow}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

// ── Componente: fila de resumen en pantalla de éxito ──────────────────────
function ResumenFila({ label, value }) {
  return (
    <View style={styles.resumenFila}>
      <Text style={styles.resumenLabel}>{label}</Text>
      <Text style={styles.resumenValue}>{value}</Text>
    </View>
  );
}

// ── Estilos ───────────────────────────────────────────────────────────────
const AZUL = '#1a6fd4';
const AZUL_CLARO = '#e8f0fb';
const VERDE = '#27ae60';
const ROJO = '#e74c3c';
const GRIS_TEXTO = '#495057';
const GRIS_FONDO = '#f0f4f8';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: GRIS_FONDO,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // ── Encabezado ──
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  headerBadge: {
    fontSize: 13,
    color: AZUL,
    fontWeight: '600',
    backgroundColor: AZUL_CLARO,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a2a4a',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },

  // ── Tarjeta ──
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },

  // ── Campo ──
  campoWrapper: {
    marginBottom: 18,
  },
  campoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: GRIS_TEXTO,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: '#212529',
    backgroundColor: '#f8f9fa',
  },
  inputNormal: {
    borderColor: '#ced4da',
  },
  inputError: {
    borderColor: ROJO,
    backgroundColor: '#fff5f5',
  },
  inputMultiline: {
    height: 90,
    textAlignVertical: 'top',
    paddingTop: 12,
  },

  // ── Error ──
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  errorIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  errorText: {
    fontSize: 12,
    color: ROJO,
    fontWeight: '500',
  },

  // ── Botón enviar ──
  btnEnviar: {
    backgroundColor: AZUL,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: AZUL,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnEnviarPressed: {
    backgroundColor: '#1558a8',
    transform: [{ scale: 0.98 }],
  },
  btnEnviarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // ── Nota ──
  nota: {
    textAlign: 'center',
    fontSize: 12,
    color: '#868e96',
    marginTop: 16,
  },

  // ── Pantalla de éxito ──
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    backgroundColor: GRIS_FONDO,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: VERDE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: VERDE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  successIcon: {
    fontSize: 38,
    color: '#fff',
    fontWeight: '700',
  },
  successTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1a2a4a',
    marginBottom: 6,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 24,
    textAlign: 'center',
  },
  successCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 28,
  },
  resumenFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  resumenLabel: {
    fontSize: 13,
    color: '#868e96',
    fontWeight: '600',
    flex: 1,
  },
  resumenValue: {
    fontSize: 13,
    color: '#212529',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },

  // ── Botón nueva cita ──
  btnNueva: {
    borderWidth: 2,
    borderColor: AZUL,
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  btnNuevaText: {
    color: AZUL,
    fontSize: 15,
    fontWeight: '700',
  },
});
